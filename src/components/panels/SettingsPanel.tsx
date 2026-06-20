import type { Dispatch } from 'react';
import { VISUAL_ASSET_MODES } from '../../assets/assetMode';
import type { GameAction } from '../../game/state';
import type { GameState, Language, VisualAssetMode } from '../../game/types';
import { t } from '../../i18n';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  debugEnabled: boolean;
};

export function SettingsPanel({ state, dispatch, debugEnabled }: Props) {
  const language = state.settings.language;
  return (
    <section className="panel settings-panel" aria-label={t(language, 'settings.title')}>
      <header className="panel-header">
        <div>
          <h2>{t(language, 'settings.title')}</h2>
          <p>{t(language, 'settings.subtitle')}</p>
        </div>
        <button type="button" onClick={() => dispatch({ type: 'SET_PANEL', panel: 'NONE' })}>
          {t(language, 'panel.close')}
        </button>
      </header>
      <div className="settings-list">
        <label className="setting-row">
          <span>{t(language, 'settings.language')}</span>
          <select
            value={state.settings.language}
            onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'language', value: event.currentTarget.value as Language })}
          >
            <option value="ko">{t(language, 'language.ko')}</option>
            <option value="en">{t(language, 'language.en')}</option>
          </select>
        </label>
        <label className="setting-row">
          <span>{t(language, 'settings.reducedMotion')}</span>
          <input
            type="checkbox"
            checked={state.settings.reducedMotion}
            onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'reducedMotion', value: event.currentTarget.checked })}
          />
        </label>
        <label className="setting-row">
          <span>{t(language, 'settings.mute')}</span>
          <input
            type="checkbox"
            checked={state.settings.muted}
            onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'muted', value: event.currentTarget.checked })}
          />
        </label>
        <label className="setting-row">
          <span>{t(language, 'settings.masterVolume')}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.settings.masterVolume}
            onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'masterVolume', value: Number(event.currentTarget.value) })}
          />
        </label>
        <label className="setting-row">
          <span>{t(language, 'settings.sfxVolume')}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={state.settings.sfxVolume}
            onChange={(event) => dispatch({ type: 'SET_SETTING', key: 'sfxVolume', value: Number(event.currentTarget.value) })}
          />
        </label>
        <label className="setting-row">
          <span>{t(language, 'settings.visualAssets')}</span>
          <select
            value={state.settings.visualAssetMode}
            onChange={(event) =>
              dispatch({ type: 'SET_SETTING', key: 'visualAssetMode', value: event.currentTarget.value as VisualAssetMode })
            }
          >
            {VISUAL_ASSET_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
        {debugEnabled && (
          <button type="button" className="primary-action" onClick={() => dispatch({ type: 'SET_DEBUG_OPEN', open: true })}>
            {t(language, 'settings.openDebug')}
          </button>
        )}
      </div>
    </section>
  );
}
