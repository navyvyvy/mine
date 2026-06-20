import { useMemo } from 'react';
import type { Dispatch } from 'react';
import { ResourceIcon } from '../ResourceIcon';
import { MINING_CORE_NODES } from '../../data/miningCoreNodes';
import { getNodeView } from '../../game/costs';
import { RESOURCE_IDS } from '../../game/constants';
import type { GameAction } from '../../game/state';
import type { GameState, ResourceId } from '../../game/types';
import { resourceName, t } from '../../i18n';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function ResourcePanel({ state, dispatch }: Props) {
  const language = state.settings.language;
  const nodeViews = useMemo(() => MINING_CORE_NODES.map((node) => getNodeView(node, state)), [state.resources, state.miningCore.activeNodeIds, state.tuning]);
  const nextShortageByResource = useMemo(() => {
    const labels = {} as Record<ResourceId, string>;
    for (const resource of RESOURCE_IDS) {
      const view = nodeViews.find((nodeView) => nodeView.state === 'AVAILABLE' && nodeView.missing[resource] > 0);
      labels[resource] = view ? (language === 'ko' ? view.node.nameKo : view.node.nameEn) : t(language, 'resources.noShortage');
    }
    return labels;
  }, [language, nodeViews]);
  const totalOwned = RESOURCE_IDS.reduce((sum, resource) => sum + state.resources[resource], 0);
  const waitingResourceCount = RESOURCE_IDS.filter((resource) => nextShortageByResource[resource] !== t(language, 'resources.noShortage')).length;
  const firstShortage = RESOURCE_IDS.find((resource) => nextShortageByResource[resource] !== t(language, 'resources.noShortage'));
  const affordableCount = nodeViews.filter((nodeView) => nodeView.state === 'AFFORDABLE').length;

  return (
    <section className="panel resource-panel" aria-label={t(language, 'resources.title')}>
      <header className="panel-header">
        <div>
          <h2>{t(language, 'resources.title')}</h2>
          <p>{t(language, 'resources.subtitle')}</p>
        </div>
        <button type="button" onClick={() => dispatch({ type: 'SET_PANEL', panel: 'NONE' })}>
          {t(language, 'panel.close')}
        </button>
      </header>
      <div className="resource-summary-line">
        <span>{t(language, 'resources.totalOwned', { total: totalOwned })}</span>
        <span>{t(language, 'resources.waitingNodes', { count: waitingResourceCount })}</span>
      </div>
      <div className="resource-table-shell">
        <table className="resource-ledger">
          <colgroup>
            <col className="resource-name-column" />
            <col className="resource-number-column" />
            <col className="resource-number-column" />
            <col className="resource-number-column" />
            <col className="resource-number-column" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">{t(language, 'resources.resource')}</th>
              <th scope="col">{t(language, 'resources.owned')}</th>
              <th scope="col">{t(language, 'resources.mined')}</th>
              <th scope="col">{t(language, 'resources.spent')}</th>
              <th scope="col">{t(language, 'resources.bonus')}</th>
            </tr>
          </thead>
          <tbody>
            {RESOURCE_IDS.map((resource) => (
              <tr key={resource}>
                <th scope="row">
                  <span className="resource-row-label">
                    <ResourceIcon resource={resource} size="tiny" />
                    <span>{resourceName(language, resource)}</span>
                  </span>
                </th>
                <td>{state.resources[resource]}</td>
                <td>{state.lifetimeMinedResources[resource]}</td>
                <td>{state.lifetimeSpentResources[resource]}</td>
                <td>{state.rewardGainedResources[resource] + state.bonusGainedResources[resource]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="resource-goal-summary">
        <span>{t(language, 'resources.affordableCore', { count: affordableCount })}</span>
        <span>
          {firstShortage
            ? t(language, 'resources.nextGoal', {
                resource: resourceName(language, firstShortage),
                target: nextShortageByResource[firstShortage]
              })
            : t(language, 'resources.noShortage')}
        </span>
      </div>
    </section>
  );
}
