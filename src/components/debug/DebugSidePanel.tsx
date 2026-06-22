import { useMemo } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { MINING_CORE_BRANCH_COUNTS, MINING_CORE_NODES } from '../../data/miningCoreNodes';
import { getAllImageAssets } from '../../assets/assetRegistry';
import { getImageAssetStatuses } from '../../assets/assetLoader';
import { SOUND_EVENT_KEYS } from '../../audio/soundEvents';
import { getSoundAssetStatus } from '../../audio/soundManager';
import { RESOURCE_IDS, RESOURCE_LABELS, formatDuration } from '../../game/constants';
import { validateEffectRecognition } from '../../game/effects';
import { validateParentRelationships } from '../../game/costs';
import { getAffordableNodeCount, type GameAction } from '../../game/state';
import { getMiningCellTargetPoint } from '../../game/targeting';
import { getOfflineMaxDepthBeforeChapterCoreM } from '../../game/tuning';
import { clearGameSave } from '../../game/save';
import type { GameState } from '../../game/types';
import { DebugToolbar } from './DebugToolbar';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

type NumericPath = {
  path: string[];
  value: number;
};

function collectNumericPaths(value: unknown, path: string[] = []): NumericPath[] {
  if (typeof value === 'number') return [{ path, value }];
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return [];
  return Object.entries(value).flatMap(([key, child]) => collectNumericPaths(child, [...path, key]));
}

function projection(state: GameState) {
  const remainingDepth = Math.max(0, state.tuning.runtime.chapterClearDepthM - state.depth);
  const seconds = remainingDepth * state.tuning.progression.projectedAverageFaceClearSeconds;
  return {
    remainingDepth,
    seconds,
    timestamp: new Date(Date.now() + seconds * 1000).toLocaleString()
  };
}

function viewportDebugInfo() {
  if (typeof window === 'undefined') return { width: 0, height: 0, shellWidth: 480, shellHeight: 720, scale: 1 };
  const width = window.innerWidth;
  const height = window.innerHeight;
  const safeWidth = Math.max(0, width - 24);
  const safeHeight = Math.max(0, height - 24);
  const shellWidth = Math.min(safeWidth, safeHeight * (2 / 3), 480);
  const shellHeight = Math.min(safeHeight, safeWidth * (3 / 2), 720);
  return {
    width,
    height,
    shellWidth,
    shellHeight,
    scale: shellWidth / 480
  };
}

function DebugSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="debug-section" open>
      <summary>{title}</summary>
      <div className="debug-section-body">{children}</div>
    </details>
  );
}

export function DebugSidePanel({ state, dispatch }: Props) {
  const effectStatus = useMemo(() => validateEffectRecognition(), []);
  const parentStatus = useMemo(() => validateParentRelationships(), []);
  const projected = useMemo(
    () => projection(state),
    [state.depth, state.tuning.progression.projectedAverageFaceClearSeconds, state.tuning.runtime.chapterClearDepthM]
  );
  const numericPaths = useMemo(() => collectNumericPaths(state.tuning), [state.tuning]);
  const viewport = viewportDebugInfo();
  const targetPoint = useMemo(() => (state.targetCellIndex === null ? null : getMiningCellTargetPoint(state.targetCellIndex)), [state.targetCellIndex]);
  const currentHitInterval = useMemo(
    () =>
      Math.max(
        state.tuning.mining.minimumHitIntervalMs,
        Math.round(state.tuning.mining.baseHitIntervalMs * (1 - state.passives.glovesHitIntervalReduction))
      ),
    [state.passives.glovesHitIntervalReduction, state.tuning.mining.baseHitIntervalMs, state.tuning.mining.minimumHitIntervalMs]
  );
  const passiveJson = useMemo(() => JSON.stringify(state.passives, null, 2), [state.passives]);
  const resetAllProgress = () => {
    if (!window.confirm('모든 진행 상황을 초기화할까요?')) return;
    clearGameSave();
    dispatch({ type: 'RESET_FRESH', nowMs: Date.now() });
    window.location.reload();
  };

  return (
    <aside className="debug-side-panel" aria-label="Debug Panel">
      <header className="debug-header">
        <div>
          <h2>Debug Panel</h2>
          <p>Runtime tuning and validation.</p>
        </div>
        <button type="button" onClick={() => dispatch({ type: 'SET_DEBUG_OPEN', open: false })}>
          Close
        </button>
      </header>
      <DebugToolbar state={state} dispatch={dispatch} />

      <DebugSection title="Runtime">
        <dl className="debug-grid">
          <div><dt>Depth</dt><dd>{state.depth}m</dd></div>
          <div><dt>Layer</dt><dd>{state.currentFace.layerName}</dd></div>
          <div><dt>Face</dt><dd>{state.currentFace.faceType}</dd></div>
          <div><dt>Pattern</dt><dd>{state.currentFace.pattern}</dd></div>
          <div><dt>Target</dt><dd>{state.targetCellIndex ?? 'None'}</dd></div>
          <div><dt>Faces clear</dt><dd>{state.clearedFaceCount}</dd></div>
          <div><dt>Active rewards</dt><dd>{state.activeRewards.length}</dd></div>
          <div><dt>Active nodes</dt><dd>{state.miningCore.activeNodeIds.length}</dd></div>
          <div><dt>Hit interval</dt><dd>{currentHitInterval}ms</dd></div>
          <div><dt>AUTO</dt><dd>{state.autoEnabled ? 'ON' : 'OFF'}</dd></div>
          <div><dt>Session</dt><dd>{formatDuration((state.nowMs - state.sessionStartedAtMs) / 1000)}</dd></div>
          <div><dt>Overlay</dt><dd>{state.activeOverlay}</dd></div>
          <div><dt>Panel</dt><dd>{state.activePanel}</dd></div>
          <div><dt>Debug open</dt><dd>{state.debugOpen ? 'Yes' : 'No'}</dd></div>
          <div><dt>Language</dt><dd>{state.settings.language}</dd></div>
          <div><dt>Viewport</dt><dd>{viewport.width}x{viewport.height}</dd></div>
          <div><dt>Reference scale</dt><dd>{viewport.scale.toFixed(3)}</dd></div>
          <div><dt>Shell</dt><dd>{Math.round(viewport.shellWidth)}x{Math.round(viewport.shellHeight)}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Economy">
        <div className="debug-resource-editor">
          {RESOURCE_IDS.map((resource) => (
            <label key={resource}>
              <span>{RESOURCE_LABELS[resource].name}</span>
              <input
                type="number"
                value={state.resources[resource]}
                onChange={(event) => dispatch({ type: 'SET_RESOURCE', resource, amount: Number(event.currentTarget.value) })}
              />
              <button type="button" onClick={() => dispatch({ type: 'ADD_RESOURCE', resource, amount: 100 })}>
                +100
              </button>
            </label>
          ))}
          <button type="button" onClick={() => dispatch({ type: 'ADD_ALL_RESOURCES', amount: 1000 })}>
            Add all +1000
          </button>
        </div>
      </DebugSection>

      <DebugSection title="Mining">
        <dl className="debug-grid">
          <div><dt>Manual mining</dt><dd>{state.tuning.mining.manualMiningEnabled ? 'Enabled' : 'Disabled'}</dd></div>
          <div><dt>Manual cooldown</dt><dd>{state.tuning.mining.manualStrikeCooldownMs}ms</dd></div>
          <div><dt>Target center</dt><dd>{targetPoint ? `${targetPoint.xPercent.toFixed(2)}%, ${targetPoint.yPercent.toFixed(2)}%` : 'None'}</dd></div>
          <div><dt>Target row/col</dt><dd>{targetPoint ? `${targetPoint.row}/${targetPoint.col}` : 'None'}</dd></div>
        </dl>
        <label className="debug-inline-control two-column">
          <span>manualMiningEnabled</span>
          <input
            type="checkbox"
            checked={state.tuning.mining.manualMiningEnabled}
            onChange={(event) => dispatch({ type: 'SET_MANUAL_MINING_ENABLED', enabled: event.currentTarget.checked })}
          />
        </label>
        <div className="debug-cell-list">
          {state.currentFace.cells.map((cell) => (
            <div key={cell.index} className="debug-cell-row">
              <span>#{cell.index}</span>
              <span>{cell.blockType}</span>
              <span>{cell.currentHits}/{cell.requiredHits}</span>
              <span>score {Math.round(state.targetScores[cell.index] ?? 0)}</span>
              <button type="button" onClick={() => dispatch({ type: 'FORCE_TARGET', cellIndex: cell.index })}>
                Target
              </button>
            </div>
          ))}
          <button type="button" onClick={() => dispatch({ type: 'FORCE_TARGET', cellIndex: null })}>
            Release target
          </button>
        </div>
      </DebugSection>

      <DebugSection title="Viewport / Generation">
        <label className="debug-inline-control">
          <span>Set depth</span>
          <input
            type="number"
            value={state.depth}
            onChange={(event) => dispatch({ type: 'SET_DEPTH', depth: Number(event.currentTarget.value) })}
          />
        </label>
        <button type="button" onClick={() => dispatch({ type: 'GENERATE_FACE' })}>
          Generate actual face
        </button>
      </DebugSection>

      <DebugSection title="Reward">
        <dl className="debug-grid">
          <div><dt>Open</dt><dd>{state.rewardEncounter ? 'Yes' : 'No'}</dd></div>
          <div><dt>Faces since</dt><dd>{state.facesSinceLastEncounter}</dd></div>
          <div><dt>Timeout</dt><dd>{state.tuning.rewards.rewardChoiceTimeoutMs}ms</dd></div>
          <div><dt>Warning</dt><dd>{state.tuning.rewards.rewardChoiceTimeoutWarningMs}ms</dd></div>
          <div><dt>Auto-pick</dt><dd>{state.tuning.rewards.rewardAutoPickEnabled ? 'Enabled' : 'Disabled'}</dd></div>
          <div><dt>Strategy</dt><dd>{state.tuning.rewards.rewardAutoPickStrategy}</dd></div>
        </dl>
        <label className="debug-inline-control two-column">
          <span>Auto-pick enabled</span>
          <input
            type="checkbox"
            checked={state.tuning.rewards.rewardAutoPickEnabled}
            onChange={(event) => dispatch({ type: 'SET_REWARD_AUTO_PICK_ENABLED', enabled: event.currentTarget.checked })}
          />
        </label>
        <label className="debug-inline-control two-column">
          <span>Auto-pick strategy</span>
          <select
            value={state.tuning.rewards.rewardAutoPickStrategy}
            onChange={(event) =>
              dispatch({ type: 'SET_REWARD_AUTO_PICK_STRATEGY', strategy: event.currentTarget.value === 'first' ? 'first' : 'highestScore' })
            }
          >
            <option value="highestScore">highestScore</option>
            <option value="first">first</option>
          </select>
        </label>
        {state.rewardEncounter?.choices.map((choice) => (
          <button key={choice.id} type="button" onClick={() => dispatch({ type: 'SELECT_REWARD', rewardId: choice.id })}>
            Select {choice.nameEn}
          </button>
        ))}
      </DebugSection>

      <DebugSection title="Nodes">
        <dl className="debug-grid">
          <div><dt>Generated nodes</dt><dd>{MINING_CORE_NODES.length}</dd></div>
          <div><dt>Branch counts</dt><dd>{Object.entries(MINING_CORE_BRANCH_COUNTS).map(([k, v]) => `${k}:${v}`).join(' ')}</dd></div>
          <div><dt>Unlocked</dt><dd>{state.miningCore.activeNodeIds.length}</dd></div>
          <div><dt>Affordable</dt><dd>{getAffordableNodeCount(state)}</dd></div>
          <div><dt>Invalid parents</dt><dd>{parentStatus.invalid.length}</dd></div>
          <div><dt>Parentless</dt><dd>{parentStatus.parentless}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Validation">
        <pre className="debug-json">{passiveJson}</pre>
        <dl className="debug-grid">
          <div><dt>Recognized effect keys</dt><dd>{effectStatus.recognized.length}</dd></div>
          <div><dt>Missing effect keys</dt><dd>{effectStatus.missing.length || 'None'}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Pickaxe / AUTO">
        <dl className="debug-grid">
          <div><dt>Forced target</dt><dd>{state.forcedTargetCellIndex ?? 'None'}</dd></div>
          <div><dt>Strike phase</dt><dd>{state.strike?.phase ?? 'READY'}</dd></div>
          <div><dt>Total hits</dt><dd>{state.totalHits}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Offline">
        <dl className="debug-grid">
          <div><dt>Last active</dt><dd>{new Date(state.lastActiveAt).toLocaleString()}</dd></div>
          <div><dt>Offline max depth</dt><dd>{getOfflineMaxDepthBeforeChapterCoreM(state.tuning)}m</dd></div>
          <div><dt>Rewarded seconds</dt><dd>{Math.round(state.totalOfflineRewardedSeconds)}</dd></div>
        </dl>
        {state.offlineSummary && <pre className="debug-json">{JSON.stringify(state.offlineSummary, null, 2)}</pre>}
      </DebugSection>

      <DebugSection title="Playtime">
        <dl className="debug-grid">
          <div><dt>Total active</dt><dd>{formatDuration(state.totalActiveSeconds)}</dd></div>
          <div><dt>AUTO mining</dt><dd>{formatDuration(state.totalAutoMiningSeconds)}</dd></div>
          <div><dt>AUTO off</dt><dd>{formatDuration(state.totalAutoOffSeconds)}</dd></div>
          <div><dt>Reward choice</dt><dd>{formatDuration(state.totalRewardChoiceSeconds)}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Progression Projection">
        <dl className="debug-grid">
          <div><dt>Remaining depth</dt><dd>{projected.remainingDepth}m</dd></div>
          <div><dt>Projected time</dt><dd>{formatDuration(projected.seconds)}</dd></div>
          <div><dt>Projected clear</dt><dd>{projected.timestamp}</dd></div>
        </dl>
      </DebugSection>

      <DebugSection title="Save">
        <dl className="debug-grid">
          <div><dt>Save reason</dt><dd>{state.lastSaveReason}</dd></div>
          <div><dt>Revision</dt><dd>{state.saveRevision}</dd></div>
          <div><dt>Status</dt><dd>{state.saveStatusMessage || 'OK'}</dd></div>
        </dl>
        <button type="button" onClick={() => dispatch({ type: 'RESET_FRESH', nowMs: Date.now() })}>
          Fresh save
        </button>
        <button type="button" className="debug-danger-action" onClick={resetAllProgress}>
          전체 초기화
        </button>
      </DebugSection>

      <DebugSection title="Sound Test">
        <dl className="debug-grid">
          <div><dt>Master</dt><dd>{state.settings.masterVolume}</dd></div>
          <div><dt>SFX</dt><dd>{state.settings.sfxVolume}</dd></div>
          <div><dt>Muted</dt><dd>{state.settings.muted ? 'Yes' : 'No'}</dd></div>
        </dl>
        <p>{SOUND_EVENT_KEYS.length} sound event keys mapped.</p>
        <pre className="debug-json">{JSON.stringify(getSoundAssetStatus(), null, 2)}</pre>
      </DebugSection>

      <DebugSection title="Image Asset Test">
        <p>{getAllImageAssets().length} image asset keys mapped. Mode: {state.settings.visualAssetMode}</p>
        <pre className="debug-json">{JSON.stringify({ assets: getAllImageAssets(), status: getImageAssetStatuses() }, null, 2)}</pre>
      </DebugSection>

      <DebugSection title="Tuning Overrides">
        <div className="tuning-list">
          {numericPaths.map(({ path, value }) => (
            <label key={path.join('.')} className="tuning-row">
              <span>{path.join('.')}</span>
              <input
                type="number"
                step="0.01"
                value={value}
                onChange={(event) => dispatch({ type: 'SET_TUNING_NUMBER', path, value: Number(event.currentTarget.value) })}
              />
            </label>
          ))}
        </div>
      </DebugSection>

      <DebugSection title="Logs">
        <ol className="debug-log">
          {state.logs.map((entry) => (
            <li key={entry.id}>
              <span>{entry.category}</span> {entry.message}
            </li>
          ))}
        </ol>
      </DebugSection>
    </aside>
  );
}
