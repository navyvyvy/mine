# Codex Workflow

This document defines how Codex should work on this project.

The project is a stone-mining / block-breaking web game.

It is not a climbing game.

The default workflow is document-based and lightweight.

Codex should follow:

- AGENTS.md
- this workflow document
- task-specific prompts
- optional separate review-only Codex sessions

External workflow tools, agent plugins, skills, and orchestration frameworks are not part of the default workflow.

They may be considered later only when the user explicitly asks for them and approves the reason.

## Tooling Policy

Do not install or integrate new workflow tools, agent plugins, skills, or orchestration frameworks as part of normal tasks.

This is not a permanent ban.

It means:

- do not add workflow tooling casually
- do not install tools just because they might be useful
- do not add agent orchestration before the project actually needs it
- do not add dependencies for planning/review behavior without approval

Before introducing any workflow tool later, first provide a short proposal that explains:

1. the problem it solves
2. why the current AGENTS.md + workflow document is not enough
3. what files/configuration/dependencies it adds
4. how it changes the development flow
5. how to remove it if it is not useful

Only proceed after explicit user approval.

## Standard Workflow

For every meaningful task, use this four-phase workflow.

## Phase 1 — Planner

Before editing:

1. Read AGENTS.md.
2. Inspect the relevant files.
3. Identify the real source of the issue.
4. List the exact files that need changes.
5. Write a short plan.
6. State what will not be touched.

Do not edit files during this phase.

The plan should be small and specific.

Bad plan:

- Rewrite mining visuals.

Good plan:

- Remove the repeated top-left cell highlight from generated-art.css.
- Reduce the long teal seam overlay in MiningFaceWallOverlay.tsx.
- Keep pickaxe, HUD, store, and balance untouched.

## Phase 2 — Implementer

Implement only the approved small plan.

Rules:

- Make the smallest safe patch.
- Prefer existing files over new systems.
- Prefer CSS-only changes for visual polish.
- Avoid new dependencies.
- Avoid broad rewrites.
- Do not perform unrelated cleanup.
- Do not change protected systems.
- If a new file must be touched, explain why.

## Phase 3 — Reviewer

Review the diff as if another engineer wrote it.

Check for:

- unrelated changes
- protected system changes
- visual regressions
- layout regressions
- missing imports
- unused code
- stale CSS
- duplicated logic
- overly broad selectors
- unnecessary abstractions
- new dependency creep
- build/type/lint risks

Protected systems:

- pickaxe size
- pickaxe placement
- HUD layout
- core mining loop
- save/load
- balance formulas
- reward formulas
- upgrade economy
- unrelated systems

Forbidden direction:

- climbing
- floors
- towers
- town
- home
- return
- expedition
- altitude/height progression

## Phase 4 — Fixer

Fix only issues found during the review phase.

Do not start a new redesign.

After fixing:

1. Run available checks from package.json.
2. Verify the requested behavior.
3. Report changed files.
4. Explain the root cause.
5. Summarize the fix.
6. Mention what was intentionally not touched.
7. Mention any remaining risks.

## Mining Visual Workflow

For mining/block/damage visual tasks, inspect these files first:

- CellDamageOverlay.tsx
- MiningFaceWallOverlay.tsx
- generated-art.css
- mining-damage.css
- mining-wall-overlays.css

Only inspect or modify App.tsx, store files, or formula files if the task directly requires them.

## Mining Visual Checklist

When improving mining visuals, check whether the current implementation has:

- repeated top-left marks
- identical crack patterns
- UI-card-like block surfaces
- overly clean gradients
- long neon trail/path effects
- full-height seam lines
- effects that look like climbing routes
- damage overlays that hide the material
- cracks that do not match damage state
- hit feedback that feels disconnected from the block

Target direction:

- rough stone
- natural cracks
- pickaxe impact
- debris/chips
- dust
- material variety
- readable damage progression
- satisfying break feedback

## Example Task Prompt

Use this structure for future tasks:

[EXAMPLE_PROMPT_START]

You are working on my stone-mining / block-breaking web game.

Read AGENTS.md and docs/CODEX_WORKFLOW.md first.

Task:
[describe task]

Hard constraints:
- Do not touch pickaxe size.
- Do not touch HUD layout.
- Do not touch core mining loop.
- Do not touch save/load.
- Do not touch balance formulas.
- Do not add dependencies.
- Do not add workflow tools unless this task explicitly asks for them.

Run the task in 4 phases:
1. Planner
2. Implementer
3. Reviewer
4. Fixer

Report:
- changed files
- root cause
- fix summary
- verification
- what was intentionally not touched

[EXAMPLE_PROMPT_END]

## Review-Only Session Prompt

For larger tasks, use a separate Codex session as a reviewer.

The review-only session must not edit files.

[REVIEW_PROMPT_START]

You are reviewing a patch for my stone-mining / block-breaking web game.

Read AGENTS.md and docs/CODEX_WORKFLOW.md first.

Review only.
Do not edit files.

Check the current diff and report:

1. Any unrelated changes
2. Any changes to protected systems:
   - pickaxe size
   - pickaxe placement
   - HUD layout
   - core mining loop
   - save/load
   - balance formulas
   - reward formulas
   - upgrade economy
3. Any forbidden direction:
   - climbing
   - floors
   - towers
   - town
   - home
   - return
   - expedition
4. Visual risks:
   - UI-card-like blocks
   - repeated stamp marks
   - full-height neon trails
   - effects that look like climbing paths
5. Build/type/lint risks
6. Suggested minimal fixes

Output:
- Pass / Needs changes
- Critical issues
- Minor issues
- Suggested exact fixes

[REVIEW_PROMPT_END]

## When to Use a Separate Review Session

Use a separate review-only Codex session when:

- more than 3 files changed
- visual systems changed
- state/store logic changed
- balance formulas changed
- build config changed
- the task felt ambiguous
- the patch may have affected layout

Do not use multi-agent automation by default.

Use this lightweight structure first:

1. One Codex session implements.
2. Another Codex session reviews the diff only.
3. The original Codex session applies minimal fixes from the review.

If this workflow becomes too slow or too manual later, propose a better workflow before adding tools.

## Future Tooling Rule

Workflow tools may be added later, but only when they solve a real project problem.

Good reasons to consider additional tooling later:

- repeated review mistakes
- too many large diffs
- multiple parallel feature branches
- frequent visual regressions
- need for automated repository audits
- need for repeatable agent review pipelines

Bad reasons:

- tool seems popular
- tool sounds useful
- tool was mentioned in a video
- tool might help someday
- adding it is easier than writing a clear task prompt

## Final Rule

When uncertain, choose the smaller change.

Do not expand the project direction.

Do not add systems.

Do not add workflow tools casually.

Do not turn the mining game back into a climbing game.
