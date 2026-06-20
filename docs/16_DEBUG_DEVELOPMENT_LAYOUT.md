# Debug Development Layout / 개발용 디버그 레이아웃

## 1. Purpose

During development, the Debug Panel must be easy to open and must not cover the game screen.

The developer should be able to see the game and operate debug tools at the same time.

## 2. Debug Entry

Development debug can be opened through URL query.

Supported query:

```text
?debug
```

Optional explicit values:

```text
?debug=1
?debug=true
```

Behavior:

```text
If debug query is present, enable debug panel on initial load.
```

This is development behavior and should work even before opening Settings Panel.

Settings Panel can still include Debug Panel Toggle.

## 3. Debug Layout Rule

Debug Panel must be visually separated from the game viewport.

It should not appear as a modal over the game during development.

Development layout:

```text
┌──────────────────────────────┬──────────────────────────────────────┐
│                              │                                      │
│        GAME VIEWPORT         │          DEBUG SIDE PANEL            │
│        480 x 720 target      │          scrollable controls         │
│                              │                                      │
└──────────────────────────────┴──────────────────────────────────────┘
```

The game screen remains playable and visible while the debug panel is open.

## 4. Desktop Layout

For desktop development:

- game viewport stays on the left
- debug side panel stays on the right
- debug panel width: 420px recommended
- debug panel min width: 360px
- debug panel max width: 560px
- debug panel is vertically scrollable
- game viewport keeps portrait aspect
- debug controls do not overlap the game

Recommended CSS layout:

```css
.dev-debug-shell {
  display: grid;
  grid-template-columns: minmax(360px, 480px) minmax(360px, 520px);
  gap: 16px;
  align-items: start;
}

.game-viewport-shell {
  width: 480px;
  max-width: 100%;
  aspect-ratio: 2 / 3;
}

.debug-side-panel {
  height: 100vh;
  overflow: auto;
}
```

## 5. Narrow Layout

For narrow screens:

- debug panel may move below the game viewport
- game viewport should remain visible
- debug panel should not permanently cover the game
- a collapse/expand control is allowed

Recommended:

```text
Desktop:
GAME | DEBUG

Narrow:
GAME
DEBUG
```

## 6. Runtime State

Debug visibility is runtime UI state.

Recommended type:

```ts
type DebugOpenSource =
  | 'URL_QUERY'
  | 'SETTINGS_TOGGLE'
  | 'HOTKEY'
  | 'RUNTIME';
```

Recommended state:

```ts
type DebugUiState = {
  enabled: boolean;
  open: boolean;
  openSource: DebugOpenSource | null;
  sidePanel: boolean;
};
```

## 7. Query Parsing

On app startup:

```ts
const params = new URLSearchParams(window.location.search);
const debugFromQuery =
  params.has('debug') &&
  params.get('debug') !== '0' &&
  params.get('debug') !== 'false';
```

If true:

```ts
debug.enabled = true
debug.open = true
debug.openSource = 'URL_QUERY'
debug.sidePanel = true
```

## 8. Hotkey

Recommended development hotkey:

```text
Ctrl + Shift + D
```

Behavior:

- toggles debug side panel
- does not reset game state
- does not change save data unless explicitly saved by settings

## 9. Debug Panel Interaction Rule

When Debug Panel is opened as side panel:

- game can continue running
- developer can pause/resume mining from debug controls
- developer can step one hit
- developer can inspect values while AUTO is running
- debug panel clicks should not block the game viewport
- game screen should remain visible for immediate feedback

For modal overlays such as Reward Encounter, Offline Reward, and Chapter Clear, the debug side panel still remains visible.

## 10. Debug in Production Builds

MVP may keep debug available behind `?debug`.

If a later release needs to hide debug:

```text
build flag can disable debug query behavior
```

MVP implementation should keep it enabled for development and testing.

## 11. Required Debug Shell Components

Recommended components:

```text
src/components/debug/DebugShell.tsx
src/components/debug/DebugSidePanel.tsx
src/components/debug/DebugSection.tsx
src/components/debug/DebugToolbar.tsx
```

Recommended app shell:

```tsx
<AppShell debugMode={debug.open}>
  <GameViewport />
  {debug.open && <DebugSidePanel />}
</AppShell>
```

## 12. Validation

Manual validation:

- opening `/` shows normal game only
- opening `/?debug` shows game viewport and debug side panel
- game viewport remains visible while debug is open
- debug side panel scrolls independently
- AUTO mining can be observed while debug panel is open
- debug controls can pause, resume, step, add resources, set depth, and force events
- debug panel does not cover the 3x3 Mining Face
- debug panel does not block equipment buttons
- Ctrl + Shift + D toggles debug panel

## Production Debug Policy

Development builds:

```text
?debug is enabled
Ctrl + Shift + D is enabled
```

Production release builds:

```text
?debug is disabled by default
debug hotkey is disabled by default
```

Recommended flag:

```ts
const ENABLE_DEBUG_QUERY =
  import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEBUG === 'true';
```

Release build default:

```text
VITE_ENABLE_DEBUG=false
```

Internal QA builds may enable the flag explicitly.
