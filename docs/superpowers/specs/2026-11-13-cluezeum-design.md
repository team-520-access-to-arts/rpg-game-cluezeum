# Cluezeum: The Thread Between Things

Status: approved by the user on November 13, 2026, including browser-cookie persistence and no backend.

## Intent

A mobile-first browser prototype of the supplied museum handheld. Students choose a role, look closely at five real Van Gogh works, collect observations, and make choices that change their route and ending. The device facilitates looking rather than rewarding screen time. The narrative is explicitly fictional; artwork information is sourced.

## Approaches

The proposed implementation is a static React/TypeScript app built with Vite and hosted on the existing repository's GitHub Pages site. Per the user's November 13 revision, browser cookies persist game progress. The prototype requires no backend, database, authentication, or API credentials.

A server-rendered app adds unnecessary hosting and maintenance. Database-backed persistence adds account setup and services that the user explicitly excluded. The selected architecture is browser-only; the framework remains a builder proposal. Bundle artwork metadata, missions, branching rules, and endings with the static app.

## Verified exhibition

The user approved a five-work virtual exhibition rather than a claim that five works are currently on display. Source status checked November 13, 2026; this is a dated snapshot, never a live availability guarantee. Include a clear collection/exhibition note and direct links in the app.

| Work | Date | Medium | MoMA status at check | Source |
| --- | --- | --- | --- | --- |
| The Starry Night | Saint Rémy, June 1889 | Oil on canvas | On view, Gallery 501 | https://www.moma.org/collection/works/79802 |
| The Olive Trees | Saint Rémy, June–July 1889 | Oil on canvas | On view, Gallery 501 | https://www.moma.org/collection/works/80013 |
| Portrait of Joseph Roulin | Arles, early 1889 | Oil on canvas | Not on view | https://www.moma.org/collection/works/79105 |
| The Potato Eaters | 1885 | Lithograph | Not on view | https://www.moma.org/collection/works/64997 |
| Portrait of Dr. Gachet (Man with a Pipe) | 1890 | Etching | Not on view | https://www.moma.org/collection/works/71621 |

The lithograph and etching must not be illustrated with similarly named oil paintings. Verify each actual image against the collection record before writing final observation questions. Use public-domain reproductions with source attribution where obtainable; record image provenance separately from factual sources. Never generate substitute artwork images. If a source image cannot be obtained, resolve that before claiming the observation game is complete.

## Experience and visual direction

Cream tactile enclosure, recessed monochrome e-ink-like panel, dark readable type, minimal decoration, and large red triangle/yellow circle/blue square buttons inspired by the reference. Desktop places the virtual artwork beside the device; mobile offers the artwork before the short device prompt. Artwork viewing preserves full color and an uncropped image where color is relevant; the device preview may be monochrome.

The opening screen introduces the five-work virtual exhibition, gives an estimated 10–15 minute playtime, and offers start/resume. Four role cards explain what changes between stories. A source drawer, audio toggle, journal, and explicit restart confirmation are supporting controls. No login form, leaderboard, countdown, or punitive scoring.

Normal device controls are triangle Observe, circle Hint, square Answer. In answer mode they select the corresponding three labeled answers. Navigation and branch-choice states show their current button functions explicitly. Keyboard shortcuts 1/2/3 mirror the buttons. Role selection cycles with previous/next/select so all core gameplay can be completed through the three controls. Shapes and visible labels ensure color is never the only cue.

Each stop: find the named artwork → activate its simulated NFC tag → receive a short role-specific mission → look at the artwork → answer one visual question → receive explanatory feedback → record a clue → choose the next lead where a branch is offered. Wrong answers invite another observation and never consume a life. An optional hint narrows where to look without auto-solving. Reflection choices are never marked wrong.

The web prototype includes an explicitly labeled tap simulation for every artwork. Real Web NFC may be added only if supported and verifiable; it is not required for this hardware simulation. A wrong tag must not unlock a different mission. Never claim a successful hardware scan based on a simulated tap.

## Four connected stories

All stories are present-day fictional interpretation exercises, not claims of secret messages, stolen artworks, or invented historical events. A historical-figure role uses a clearly labeled imagined perspective of Joseph Roulin, whose identity as Van Gogh's friend and a postal employee is supported by MoMA. No fabricated quotations or first-person claims about his actual thoughts.

| Role | Mission | Observation emphasis | Ending pair |
| --- | --- | --- | --- |
| Detective | Reconstruct a curator's fictional missing exhibition theme | Repeated forms, contrasts, and links between scenes | Pattern Finder / Keeper of Human Stories |
| Collector | Assemble a virtual collection around a chosen theme | Visual relationships and reasons for grouping works | Cabinet of Movement / Cabinet of Connection |
| Artist | Build an imaginary sketchbook of techniques | Line, shape, light, composition, and texture | Rhythm Maker / Story Painter |
| Historical figure: Roulin | Assemble an imagined postcard trail for a visitor | People, surroundings, and what an image communicates | Messenger of Places / Messenger of People |

Each role has five distinct mission prompts, hints, clue descriptions, and conclusion text. Some objective details can overlap between roles, but the game must not merely swap the role name over identical copy.

## Branching structure

All players begin at The Starry Night. Its visual relationship between earth and sky introduces the game's theme of connections. A choice follows: pursue landscape rhythm (The Olive Trees next) or human connection (Roulin next). The remaining works are visited without repetition, with a second choice after stop three between the two unvisited works. Thus every route includes five works while changing their order and narrative transitions.

Choices accumulate a nature/form or people/story emphasis. With two binary decisions, ties resolve using the most recent choice. The ending combines that emphasis with the role, yielding eight named endings and a journal of the actual route and collected clues. Factual quiz correctness does not determine a moral or historical interpretation. Changing both branch decisions must produce a different ending; a route choice must change the next work, not just decorative text.

Question anchors to develop after image inspection: the cypress and sky in The Starry Night; tree contours, mountains, and cloud in The Olive Trees; uniform and floral backdrop in Roulin; table scene in the exact Potato Eaters lithograph; pipe and linework in the exact Gachet etching. Final answer keys require image verification. All interpretation questions distinguish personal response from observable facts.

## Audio and accessibility

User-initiated browser speech reads original short mission and hint text, with stop/replay and always-visible equivalent text. No autoplay and no reuse of MoMA audio. If speech synthesis is unavailable, retain the complete readable flow and identify the limitation. Audio routing uses the user's device/headphones; the browser cannot verify wired earphones. Request that visitors use headphones before enabling narration.

Responsive layout from 320px through desktop, at least 44px controls, visible focus, semantic headings, accessible button names, polite feedback announcements, reduced-motion support, and no interaction requiring dragging or color vision. After a transition, focus must move appropriately without stealing focus during answer feedback.

## Persistence and deployment

Persist compact, versioned game progress in a first-party browser cookie after each meaningful transition. Save only IDs and small values: role, artwork route, answers, branch choices, current stage, and audio preference. Derive clue text, mission copy, and endings from bundled content rather than duplicating them in the cookie. Keep the entire encoded cookie comfortably below 4 KB and test the largest possible completed session.

Use a project-specific cookie name, a path scoped to the GitHub Pages project directory, SameSite=Lax, a 30-day Max-Age, and Secure on HTTPS. Omit Domain so the cookie stays host-only. Client-side JavaScript must read the cookie, so it cannot be HttpOnly; store no personal information, credentials, or sensitive data. Save only on the current browser, with no cross-device sync. Restart deletes the same cookie using its exact name and path before beginning a new game.

Validate the schema version, role and artwork IDs, answer bounds, stage, and route consistency before restoring. Ignore malformed or incompatible cookies and show a friendly fresh-start message. Confirm writes by reading them back; if cookies are blocked, full, or unavailable, continue in memory and state that progress will not survive reload. Do not silently substitute a database or localStorage. Clearing browser cookies or using another browser starts a separate session.

Supply static build/run instructions and GitHub Actions Pages deployment. No migrations, database provisioning, authentication, server functions, or environment secrets are needed. Cookie saving must work without network requests once the app has loaded; offline initial loading is not promised without a separately implemented cache.

Target repository: team-520-access-to-arts/rpg-game-cluezeum. Respect its Pages subpath and verify deployment rather than claiming success from a build alone. Do not create a separate Sites-hosted application because GitHub hosting was explicitly requested.

## Verification and completion

Test the game state machine across four roles, both route branches, all eight endings, wrong answers, hints, resume, restart, invalid stored data, and unavailable speech. Verify every source/image pairing and answer key. Browser-check mobile and desktop for overflow, focus, three-button gameplay, and usable artwork viewing. Verify cookie writes and reload/resume, the encoded size at maximum progress, project-path scoping, expiry and deletion on restart, invalid and outdated cookies, and the in-memory fallback when cookies are blocked. Verify persistence does not require network requests or backend configuration. Verify the published GitHub Pages URL and its deployed revision.

Completion means the deployed playable app, five accurate works, twenty role-specific missions, meaningful routes and endings, accessible handheld controls, audio, NFC simulation, and functioning browser-cookie persistence, with no backend or database dependencies. Missing publication is reported as outstanding, not silently replaced with a smaller goal.

## Builder discretion

The builder chooses exact spacing, typography, icons, state-machine organization, test tools, cookie encoding, original narrative wording, and appropriate dependencies. Keep the experience small and coherent. No additional feature approvals are needed for these details once this design is approved.
