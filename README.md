# Cluezeum

A mobile-first, three-button museum RPG prototype inspired by a dedicated e-ink handheld. Explore five verified Van Gogh works from MoMA's collection as a detective, collector, artist, or an imagined messenger inspired by Joseph Roulin.

## Run locally

Requires Node.js 20.19+ (Node 22 recommended).

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/rpg-game-cluezeum/`.

```sh
npm test            # Game routes, endings, and cookie validation
npm run build       # TypeScript checks and static production build
npx playwright install chromium
npm run test:e2e    # Browser gameplay checks
npm run preview     # Serve the production build locally
```

## How it works

- Four roles with twenty original observation missions and eight endings.
- Every route visits five works. Two choices change the order and the narrative emphasis.
- Triangle, circle and square buttons map to keys **1**, **2**, **3**. Labels change with context.
- Artwork tags explicitly simulate NFC. No physical reader or hardware scanning is required.
- User-enabled browser speech provides narration and hints. All content is also readable; voices depend on the browser and operating system.
- A versioned first-party cookie saves progress for 30 days. It contains compact game values, no personal information. Saves are scoped to the repository path and validated by replaying the game. If cookies are blocked, play continues in memory with a notice.
- No backend, database, account, analytics, API keys, or environment configuration. Assets and game content are bundled. Fonts use Google Fonts with system fallbacks; artwork images are hosted with the app.

## Exhibition accuracy

This is a **virtual exhibition**, not a claim that all five works are currently on display. MoMA listed only The Starry Night and The Olive Trees as on view when checked November 13, 2026. The other works are Portrait of Joseph Roulin, The Potato Eaters (**lithograph**), and Portrait of Dr. Gachet (Man with a Pipe) (**etching**). All artwork records are linked in the app. Display information is a dated snapshot.

The narrative is original fiction. Observation answers refer to visible details, not invented facts or historical quotations. This project is independent of MoMA. See [asset sources](docs/asset-sources.md) and [image verification](docs/artwork-verification.md).

## GitHub Pages deployment

The repository is configured for `https://team-520-access-to-arts.github.io/rpg-game-cluezeum/` (target URL, not a claim of current deployment).

1. A repository administrator selects **Settings → Pages → Source → GitHub Actions**.
2. Push the approved code to `main`, or merge a reviewed pull request.
3. The included workflow installs dependencies, runs unit and browser tests, builds the static app, and deploys `dist/` after checks pass.
4. Verify the workflow's deployed URL. If moving to another repository, change `base` in `vite.config.ts` and the URL in `playwright.config.ts`.

No Supabase or server setup is needed. Repository write access and permission to configure Pages are required for publication.

## Structure

- `src/content.ts`: attributed artwork metadata, roles, questions, hints and endings.
- `src/game.ts`: pure, stage-guarded game transitions.
- `src/persistence.ts`: compact cookie encoding and reachable-state validation.
- `src/App.tsx`, `src/components/`: gallery and handheld UI, audio, journal and dialogs.
- `public/art/`: verified artwork reproductions.
- `tests/`: browser flow checks.
- `docs/superpowers/specs/2026-11-13-cluezeum-design.md`: approved design.

## Verification status

See [implementation log](docs/implementation-log.md) for executed checks and outstanding deployment or browser-verification work. A production build alone does not establish that the site is deployed.
