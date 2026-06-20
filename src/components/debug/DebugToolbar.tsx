import type { Dispatch } from 'react';
import type { GameAction } from '../../game/state';
import type { GameState } from '../../game/types';

type Props = {
  state: GameState;
  dispatch: Dispatch<GameAction>;
};

export function DebugToolbar({ state, dispatch }: Props) {
  return (
    <div className="debug-toolbar" aria-label="Debug toolbar">
      <button type="button" onClick={() => dispatch({ type: 'PAUSE_TOGGLE' })}>
        {state.miningPaused ? 'Resume mining' : 'Pause mining'}
      </button>
      <button type="button" onClick={() => dispatch({ type: 'STEP_HIT' })}>
        Step hit
      </button>
      <button type="button" onClick={() => dispatch({ type: 'CLEAR_FACE' })}>
        Clear face
      </button>
      <button type="button" onClick={() => dispatch({ type: 'OPEN_REWARD_NOW' })}>
        Open reward
      </button>
    </div>
  );
}
