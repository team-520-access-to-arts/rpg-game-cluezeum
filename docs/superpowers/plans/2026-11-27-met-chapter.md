# The Sky Archive Implementation Plan

**Goal:** Add a selectable seven-work chapter based on The Met's current Chasing Clouds exhibition.
**Architecture:** Extend the existing React/Vite game with chapter metadata, shared artwork types, chapter-specific roles/missions and bounded routes. Keep legacy saves and Van Gogh behavior intact.
**Authorization:** User delegated remaining design and implementation choices on November 27, 2026.

- [x] Verify seven exhibition objects against individual Met records; bundle public-domain images and document provenance. Preserve discrepancies between exhibition membership and physical display status.
- [x] Add failing tests for seven-stop branches, wrong answers, cross-chapter inputs, both endings, legacy saves and Met save replay. Implement chapter-aware game and persistence.
- [x] Add chapter selection, factual introductions with citations, fictional mission labels, contextual gallery/about/journal/ending text and mobile styles. Keep four perspectives; Messenger is contemporary fiction in the Met chapter.
- [x] Add mobile browser journey covering chapter switching, sources, images, reload/resume, seven stops and no horizontal overflow. Run all tests and production build.
- [x] Review changes and record verification and source limitations.

## Review focus
Legacy cookies missing chapter default to Van Gogh. Unknown chapters and mixed routes are rejected. Selecting another chapter cannot silently replace a save. No fabricated physical route or live display claim. All seven artwork images must load at phone dimensions.

## Content decision
Use Gandy, Delacroix, Marville, Le Gray, McEntee, Sargent and Richards. These seven are in the exhibition object list and have public-domain images. Gandy, McEntee, Sargent and Richards object pages say not on view; show this discrepancy rather than imply all seven are physically available. All gameplay is a virtual companion to the current exhibition.

## Verification

- Unit tests: 26 passed, including all Met roles/branch combinations, every reachable save stage, invalid chapter rejection and existing Van Gogh coverage.
- Browser tests: 7 passed using installed Google Chrome (`PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`). Includes 390 × 844 gameplay and 320px layout/source-dialog checks.
- Production TypeScript/Vite build passed.
- Static independent review: no outstanding findings. A test-only Observe-button selector was corrected after its failure; the full browser suite passed afterward.
- Bundled Chromium was absent; download was declined. Used already-installed Chrome with approval, without downloading a browser.
- No deployment or publication performed.
