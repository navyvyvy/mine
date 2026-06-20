# AGENTS.md

## Project Identity

This project is a stone-mining / block-breaking web game.

Treat the game as a mining game where the player breaks stone blocks, reveals materials, gains rewards, upgrades mining power, and improves idle mining progression.

This is NOT a climbing game.

Do not introduce or revive any of the following systems unless explicitly requested:

- climbing
- floors
- towers
- mountain progression
- town
- home
- return
- expedition
- stage climbing
- height/altitude progression

The current game direction is:

- mining face
- block breaking
- stone damage
- cracks
- pickaxe impact
- materials/ores
- idle mining progression
- rewards
- upgrades
- clear readable HUD

## Tooling Policy

Use lightweight repository guidance by default.

Default workflow guidance should come from:

- AGENTS.md
- docs/CODEX_WORKFLOW.md
- task-specific prompts
- optional review-only Codex sessions

Do not install, configure, or integrate new workflow tools, agent plugins, skills, or orchestration frameworks unless the user explicitly requests and approves it for a specific reason.

External workflow tools are not banned forever, but they are not part of the default workflow.

Before adding any new workflow or agent tool, first explain:

1. why the current document-based workflow is not enough
2. what problem the tool solves
3. what files or configuration it will add
4. what dependencies it introduces
5. how to remove it if it does not help

Do not add new dependencies for workflow, planning, reviewing, or agent behavior without explicit approval.

## Default Work Style

Use a minimal-change workflow.

Before editing files:

1. Inspect the relevant files.
2. Identify the actual source of the issue.
3. List the exact files that need changes.
4. Write a short implementation plan.
5. Avoid guessing from file names only.

When implementing:

1. Make the smallest safe change.
2. Reuse existing components, CSS classes, variables, and store fields.
3. Prefer editing existing files over creating new architecture.
4. Do not rewrite unrelated systems.
5. Do not add dependencies unless explicitly approved.
6. Do not rename public state fields unless every usage is updated.
7. Do not remove existing features unless the task specifically requests removal.

## Required Task Phases

For non-trivial work, follow this sequence inside the same Codex session:

### Phase 1 — Planner

- Inspect relevant files.
- Identify the real source of the issue.
- List exact files to edit.
- Write a short plan.
- Do not edit files yet.

### Phase 2 — Implementer

- Apply only the smallest safe patch.
- Stay within the planned files.
- If another file must be touched, explain why.
- Do not perform opportunistic cleanup.

### Phase 3 — Reviewer

Review your own diff as if you are a separate reviewer.

Check for:

- unrelated changes
- overengineering
- broken layout
- stale CSS
- missing imports
- unused code
- type/build errors
- visual regressions
- forbidden system changes

### Phase 4 — Fixer

- Fix only issues found during review.
- Run available checks/build commands from package.json.
- Report changed files, root cause, fix summary, verification, and what was intentionally not touched.

## Protected Areas

Do not modify these unless the user explicitly asks:

- pickaxe size
- pickaxe placement
- HUD layout
- core mining loop
- save/load logic
- balance formulas
- upgrade economy
- reward formulas
- global app layout
- unrelated game systems

For visual tasks, prefer CSS-only or overlay-only changes when possible.

## Mining Visual Direction

The mining area should feel like rough stone being broken by repeated pickaxe hits.

Prioritize:

- rough stone surface
- natural cracks
- impact marks
- debris
- chips
- dust
- material variation
- readable damage stages
- satisfying hit feedback
- clear broken/revealed states

Avoid:

- UI-card-like blocks
- overly clean gradients
- repeated top-left stamp marks
- repeated identical damage patterns
- full-height neon trails
- long path-like overlays
- climbing-path visuals
- effects that look like tower/floor progression
- unrelated fantasy systems

## Mining Visual Files

When working on mining/block/damage visuals, inspect these first:

- CellDamageOverlay.tsx
- MiningFaceWallOverlay.tsx
- generated-art.css
- mining-damage.css
- mining-wall-overlays.css

Only touch App.tsx or store files if the task requires state/layout wiring.

## CSS Rules

When changing CSS:

- Prefer local class changes over global resets.
- Avoid broad selectors that affect unrelated UI.
- Keep existing responsive behavior intact.
- Avoid changing layout dimensions unless requested.
- Use existing CSS variables when possible.
- Remove or reduce repeated visual artifacts instead of adding more layers.
- Keep damage effects readable at small sizes.

## React Rules

When changing React components:

- Keep component responsibilities narrow.
- Do not move state unless necessary.
- Do not introduce new global state unless requested.
- Avoid unnecessary memoization or abstraction.
- Keep generated visual overlays deterministic enough to avoid hydration/render instability.
- Preserve existing props unless all call sites are updated.

## Verification

After changes, run the available commands from package.json when possible.

Prefer:

- npm run build
- npm run lint
- npm run test
- npm run typecheck

Only run commands that actually exist.

If browser verification is needed, describe what was checked:

- DOM classes
- overlay count
- visual state
- responsive behavior
- absence of forbidden visual artifacts

## Report Format

After finishing a task, report:

1. Changed files
2. Root cause
3. Fix summary
4. Verification
5. What was intentionally not touched
6. Any remaining risks

Do not claim a visual issue is fixed unless the relevant source was inspected and the change directly addresses it.
