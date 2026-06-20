import type { Dispatch, ReactNode } from 'react';
import type { GameAction } from '../../game/state';
import type { GameState } from '../../game/types';
import { DebugSidePanel } from './DebugSidePanel';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
  children: ReactNode;
};

export function DebugShell({ state, dispatch, children }: Props) {
  const debugOpen = state.debugOpen;
  return (
    <div className={`app-debug-shell ${debugOpen ? 'debug-open' : ''}`}>
      {children}
      {debugOpen && <DebugSidePanel state={state} dispatch={dispatch} />}
    </div>
  );
}
