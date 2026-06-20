import { useEffect, useMemo, useReducer, useRef } from 'react';
import type { CSSProperties, Dispatch } from 'react';
import { DebugShell } from './components/debug/DebugShell';
import { MiningFace } from './components/mining/MiningFace';
import { MiningCorePanel } from './components/panels/MiningCorePanel';
import { ResourcePanel } from './components/panels/ResourcePanel';
import { ResourceIcon } from './components/ResourceIcon';
import { SettingsPanel } from './components/panels/SettingsPanel';
import { playSound } from './audio/soundManager';
import { RESOURCE_IDS, formatDuration } from './game/constants';
import { getRewardChoiceTemplate } from './game/rewards';
import { clearGameSave, loadGameSave, writeGameSave } from './game/save';
import { createGameStateFromSave, createSaveData, gameReducer } from './game/state';
import { effectSummary, layerName, resourceName, rewardDescription, rewardDurationName, rewardKindLabel, rewardName, rewardRankName, t } from './i18n';
import type { ActiveRewardEffect, ResourceId, RewardChoice } from './game/types';

const APP_TICK_INTERVAL_MS = 50;
const SAVE_CHECK_INTERVAL_MS = 1000;

function debugAllowed(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true';
}

function queryRequestsDebug(): boolean {
  if (typeof window === 'undefined') return false;
  const value = new URLSearchParams(window.location.search).get('debug');
  return value === '' || value === '1' || value === 'true';
}

function formatHudAmount(value: number): string {
  if (value >= 1_000_000) {
    const amount = value / 1_000_000;
    return `${amount >= 10 ? Math.floor(amount) : Math.floor(amount * 10) / 10}M`;
  }
  if (value >= 1_000) {
    const amount = value / 1_000;
    return `${amount >= 10 ? Math.floor(amount) : Math.floor(amount * 10) / 10}K`;
  }
  return `${value}`;
}

function TopHud({ state }: { state: ReturnType<typeof createGameStateFromSave> }) {
  const language = state.settings.language;
  const sessionSeconds = (state.nowMs - state.sessionStartedAtMs) / 1000;
  const ownedResources = RESOURCE_IDS.filter((resource) => state.resources[resource] > 0);
  const visibleResources = ([...ownedResources, ...RESOURCE_IDS] as ResourceId[])
    .filter((resource, index, list) => list.indexOf(resource) === index)
    .slice(0, 3);
  const hiddenOwnedCount = ownedResources.filter((resource) => !visibleResources.includes(resource)).length;
  return (
    <header className="top-hud" aria-label={t(language, 'aria.topHud')}>
      <div className="depth-display">
        <span className="hud-depth-icon" aria-hidden="true" />
        <strong>{state.depth}m</strong>
        <span className="hud-layer-name">{layerName(language, state.currentFace.layerName)}</span>
      </div>
      <span className="session-timer">{formatDuration(sessionSeconds)}</span>
      <div className="resource-strip" aria-label={t(language, 'aria.resources')}>
        {visibleResources.map((resource) => (
          <span key={resource} className="hud-resource" title={resourceName(language, resource)}>
            <ResourceIcon resource={resource} size="tiny" />
            <strong>{formatHudAmount(state.resources[resource])}</strong>
          </span>
        ))}
        {hiddenOwnedCount > 0 && <span className="resource-more">+{hiddenOwnedCount}</span>}
      </div>
    </header>
  );
}

function QuickControls({ state, dispatch }: { state: ReturnType<typeof createGameStateFromSave>; dispatch: Dispatch<Parameters<typeof gameReducer>[1]> }) {
  const language = state.settings.language;
  return (
    <nav className="quick-controls" aria-label={t(language, 'aria.bottomControls')}>
      <button type="button" className={`control-button ${state.autoEnabled ? 'is-on' : 'is-off'}`} onClick={() => dispatch({ type: 'TOGGLE_AUTO' })}>
        <span className="control-icon icon-auto" aria-hidden="true" />
        <span>{t(language, 'bottom.auto')}</span>
      </button>
      <button type="button" className={`control-button ${state.activePanel === 'RESOURCE' ? 'is-active' : ''}`} onClick={() => dispatch({ type: 'SET_PANEL', panel: 'RESOURCE' })}>
        <span className="control-icon icon-resources" aria-hidden="true" />
        <span>{t(language, 'bottom.resources')}</span>
      </button>
      <button type="button" className={`control-button ${state.activePanel === 'MINING_CORE' ? 'is-active' : ''}`} onClick={() => dispatch({ type: 'SET_PANEL', panel: 'MINING_CORE', branch: 'CENTER' })}>
        <span className="control-icon icon-core" aria-hidden="true" />
        <span>{t(language, 'bottom.core')}</span>
      </button>
      <button type="button" className={`control-button ${state.activePanel === 'SETTINGS' ? 'is-active' : ''}`} onClick={() => dispatch({ type: 'SET_PANEL', panel: 'SETTINGS' })}>
        <span className="control-icon icon-settings" aria-hidden="true" />
        <span>{t(language, 'bottom.settings')}</span>
      </button>
    </nav>
  );
}

function activeRewardChipText(effect: ActiveRewardEffect, language: ReturnType<typeof createGameStateFromSave>['settings']['language']): string {
  const template = getRewardChoiceTemplate(effect.sourceRewardId);
  const name = template ? rewardName(template, language) : effectSummary(language, effect.effectKey, undefined);
  if (language === 'ko') {
    if (effect.duration === 'NEXT_FACE_START') return `다음 채굴면: ${name}`;
    if (effect.duration === 'NEXT_FACE_CLEAR') return `${name} 대기 중`;
    return `이번 채굴면 효과: ${name}`;
  }
  if (effect.duration === 'NEXT_FACE_START') return `Next face: ${name}`;
  if (effect.duration === 'NEXT_FACE_CLEAR') return `${name} pending`;
  return `This face: ${name}`;
}

function TempEffectLayer({
  tempEffect,
  language
}: {
  tempEffect: ActiveRewardEffect | undefined;
  language: ReturnType<typeof createGameStateFromSave>['settings']['language'];
}) {
  if (!tempEffect) return null;
  return (
    <div className="temp-effect-layer" aria-live="polite">
      <span className="temp-effect-chip">
        <span aria-hidden="true">✦</span>
        <strong>{activeRewardChipText(tempEffect, language)}</strong>
      </span>
    </div>
  );
}

function ToastLayer({ state, hasTempEffect }: { state: ReturnType<typeof createGameStateFromSave>; hasTempEffect: boolean }) {
  const language = state.settings.language;
  const toast = state.toasts[state.toasts.length - 1];
  if (!toast) return null;
  return (
    <div className={`toast-layer ${hasTempEffect ? 'has-temp-effect' : ''}`} aria-live="polite">
      <div className="game-toast">
        {toast.icon && <span aria-hidden="true">{toast.icon}</span>}
        <strong>{language === 'ko' ? toast.messageKo : toast.messageEn}</strong>
      </div>
    </div>
  );
}

function rewardScore(choice: RewardChoice): number {
  const rankScore = choice.rank === 'RARE' ? 300 : choice.rank === 'UNCOMMON' ? 180 : 100;
  const kindScore = choice.kind === 'MATERIAL' ? Number(choice.amount ?? 0) : 40;
  return rankScore + kindScore;
}

function RewardCard({
  choice,
  language,
  autoPick,
  onSelect
}: {
  choice: RewardChoice;
  language: ReturnType<typeof createGameStateFromSave>['settings']['language'];
  autoPick: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <button type="button" className={`reward-card rank-${choice.rank.toLowerCase()} ${autoPick ? 'is-auto-pick' : ''}`} onClick={() => onSelect(choice.id)}>
      <span className="reward-rank">{rewardRankName(language, choice.rank)} · {rewardKindLabel(language, choice.kind)}</span>
      <strong>{rewardName(choice, language)}</strong>
      <span>{rewardDescription(choice, language)}</span>
      <small>{rewardDurationName(language, choice.duration)}</small>
      {autoPick && <em>{t(language, 'reward.autoPick')}</em>}
    </button>
  );
}

function OverlayLayer({ state, dispatch }: { state: ReturnType<typeof createGameStateFromSave>; dispatch: Dispatch<Parameters<typeof gameReducer>[1]> }) {
  const language = state.settings.language;
  if (state.activeOverlay === 'REWARD_ENCOUNTER' && state.rewardEncounter) {
    const elapsedMs = Math.max(0, state.nowMs - state.rewardEncounter.openedAtMs);
    const remainingMs = Math.max(0, state.tuning.rewards.rewardChoiceTimeoutMs - elapsedMs);
    const progress = state.tuning.rewards.rewardChoiceTimeoutMs > 0 ? remainingMs / state.tuning.rewards.rewardChoiceTimeoutMs : 0;
    const warning = remainingMs <= state.tuning.rewards.rewardChoiceTimeoutWarningMs;
    const autoPickId = state.tuning.rewards.rewardAutoPickStrategy === 'first'
      ? state.rewardEncounter.choices[0].id
      : [...state.rewardEncounter.choices].sort((a, b) => rewardScore(b) - rewardScore(a))[0]?.id;
    return (
      <div className={`overlay reward-overlay ${warning ? 'is-warning' : ''}`} role="dialog" aria-label={t(language, 'reward.title')}>
        <div className="overlay-panel">
          <div className="reward-overlay-header">
            <h2>{t(language, 'reward.title')}</h2>
            <span>{Math.ceil(remainingMs / 1000)}s</span>
          </div>
          <div className="reward-timebar" aria-label="Reward choice timeout">
            <span className="reward-timebar-fill" style={{ '--reward-time-ratio': Math.max(0, Math.min(1, progress)) } as CSSProperties} />
          </div>
          <p>{state.tuning.rewards.rewardAutoPickEnabled ? t(language, 'reward.autoHint') : t(language, 'reward.manualHint')}</p>
          <div className="reward-choice-grid">
            {state.rewardEncounter.choices.map((choice) => (
              <RewardCard
                key={choice.id}
                choice={choice}
                language={language}
                autoPick={state.tuning.rewards.rewardAutoPickEnabled && choice.id === autoPickId}
                onSelect={(rewardId) => dispatch({ type: 'SELECT_REWARD', rewardId })}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (state.activeOverlay === 'OFFLINE_REWARD' && state.offlineSummary) {
    return (
      <div className="overlay offline-overlay" role="dialog" aria-label={t(language, 'offline.title')}>
        <div className="overlay-panel">
          <h2>{t(language, 'offline.title')}</h2>
          <p>{language === 'ko' ? (state.offlineSummary.chapterBlocked ? '다음 활성 채굴에서 챕터 코어를 발견할 수 있습니다.' : '오프라인 보상이 적용되었습니다.') : state.offlineSummary.message}</p>
          <p>
            +{state.offlineSummary.estimatedDepthGained}m · {formatDuration(state.offlineSummary.cappedSeconds)} {t(language, 'offline.credited')}
          </p>
          <button type="button" onClick={() => dispatch({ type: 'CLEAR_SAVE_STATUS' })}>
            {t(language, 'offline.continue')}
          </button>
        </div>
      </div>
    );
  }
  if (state.activeOverlay === 'CHAPTER_CLEAR') {
    return (
      <div className="overlay chapter-overlay" role="dialog" aria-label={t(language, 'chapter.title')}>
        <div className="overlay-panel">
          <h2>{t(language, 'chapter.title')}</h2>
          <p>{t(language, 'chapter.body')}</p>
          <button type="button" onClick={() => dispatch({ type: 'SET_PANEL', panel: 'MINING_CORE', branch: 'DEEP_CORE' })}>
            {t(language, 'chapter.viewDeepCore')}
          </button>
        </div>
      </div>
    );
  }
  return null;
}

function ActivePanel({ state, dispatch }: { state: ReturnType<typeof createGameStateFromSave>; dispatch: Dispatch<Parameters<typeof gameReducer>[1]> }) {
  if (state.activePanel === 'MINING_CORE') return <MiningCorePanel state={state} dispatch={dispatch} />;
  if (state.activePanel === 'RESOURCE') return <ResourcePanel state={state} dispatch={dispatch} />;
  if (state.activePanel === 'SETTINGS') return <SettingsPanel state={state} dispatch={dispatch} debugEnabled={debugAllowed()} />;
  return null;
}

export function App() {
  const loadResult = useMemo(() => loadGameSave(), []);
  const [state, dispatch] = useReducer(gameReducer, loadResult.save, (save) => createGameStateFromSave(save));
  const latestStateRef = useRef(state);
  const lastSavedRevision = useRef(state.saveRevision);
  const lastPeriodicSaveAt = useRef(Date.now());
  const previousStrikePhase = useRef(state.strike?.phase ?? 'READY');
  const previousFlyoutCount = useRef(state.flyouts.length);
  const previousOverlay = useRef(state.activeOverlay);
  const allowedDebug = debugAllowed();

  latestStateRef.current = state;

  useEffect(() => {
    if (allowedDebug && queryRequestsDebug()) {
      dispatch({ type: 'SET_DEBUG_OPEN', open: true });
    }
  }, [allowedDebug]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch({ type: 'TICK', nowMs: Date.now() });
    }, APP_TICK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!allowedDebug) return;
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_DEBUG' });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [allowedDebug]);

  useEffect(() => {
    const saveIfNeeded = () => {
      const latest = latestStateRef.current;
      const now = Date.now();
      if (
        latest.saveRevision !== lastSavedRevision.current ||
        now - lastPeriodicSaveAt.current >= latest.tuning.runtime.autosaveIntervalMs
      ) {
        writeGameSave(createSaveData(latest));
        lastSavedRevision.current = latest.saveRevision;
        lastPeriodicSaveAt.current = now;
      }
    };

    const interval = window.setInterval(saveIfNeeded, SAVE_CHECK_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.saveRevision !== lastSavedRevision.current) {
      const now = Date.now();
      writeGameSave(createSaveData(state));
      lastSavedRevision.current = state.saveRevision;
      lastPeriodicSaveAt.current = now;
    }
  }, [state.saveRevision]);

  useEffect(() => {
    const saveNow = () => writeGameSave(createSaveData(latestStateRef.current));
    const saveOnVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        saveNow();
      }
    };
    window.addEventListener('beforeunload', saveNow);
    document.addEventListener('visibilitychange', saveOnVisibilityChange);
    return () => {
      window.removeEventListener('beforeunload', saveNow);
      document.removeEventListener('visibilitychange', saveOnVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const phase = state.strike?.phase ?? 'READY';
    if (phase === 'AIM_TO_TARGET' && previousStrikePhase.current === 'READY') playSound('mine_aim', state.settings);
    if (phase === 'IMPACT' && previousStrikePhase.current !== 'IMPACT') playSound('mine_impact', state.settings);
    previousStrikePhase.current = phase;
  }, [state.strike?.phase, state.settings]);

  useEffect(() => {
    if (state.flyouts.length > previousFlyoutCount.current) playSound('resource_gain', state.settings);
    previousFlyoutCount.current = state.flyouts.length;
  }, [state.flyouts.length, state.settings]);

  useEffect(() => {
    if (state.activeOverlay === 'REWARD_ENCOUNTER' && previousOverlay.current !== 'REWARD_ENCOUNTER') playSound('reward_open', state.settings);
    if (state.activeOverlay === 'CHAPTER_CLEAR' && previousOverlay.current !== 'CHAPTER_CLEAR') playSound('chapter_clear', state.settings);
    previousOverlay.current = state.activeOverlay;
  }, [state.activeOverlay, state.settings]);

  useEffect(() => {
    if (loadResult.error) {
      clearGameSave();
    }
  }, [loadResult.error]);

  const lanternRevealActive = state.nowMs < state.lanternRevealUntilMs;
  const faceTransitionActive = state.nowMs < state.faceTransitionUntilMs;
  const tempEffect = state.activeRewards[state.activeRewards.length - 1];

  return (
    <DebugShell state={state} dispatch={dispatch}>
      <main className="game-shell">
        <div className="game-viewport">
          <TopHud state={state} />
          <TempEffectLayer tempEffect={tempEffect} language={state.settings.language} />
          <ToastLayer state={state} hasTempEffect={Boolean(tempEffect)} />
          <MiningFace
            face={state.currentFace}
            settings={state.settings}
            tuning={state.tuning}
            strike={state.strike}
            targetCellIndex={state.targetCellIndex}
            flyouts={state.flyouts}
            nowMs={state.nowMs}
            lanternRevealActive={lanternRevealActive}
            faceTransitionActive={faceTransitionActive}
            autoEnabled={state.autoEnabled}
            manualMiningEnabled={state.tuning.mining.manualMiningEnabled}
            debugOpen={state.debugOpen}
            onManualStrike={(cellIndex) => dispatch({ type: 'MANUAL_CELL_STRIKE', cellIndex, nowMs: Date.now() })}
          />
          <QuickControls state={state} dispatch={dispatch} />
          <OverlayLayer state={state} dispatch={dispatch} />
          <ActivePanel state={state} dispatch={dispatch} />
        </div>
      </main>
    </DebugShell>
  );
}
