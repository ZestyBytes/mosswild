# Mosswild

A small, playable canvas game about exploring a valley, befriending creatures, farming and returning to idle progress. The canonical working project is C:\Users\Jamie Bassett\Dev\mosswild.

## Play locally

Run `npm run preview`, then open http://127.0.0.1:4173. The local preview saves on this device. The hosted private Site additionally backs up to the signed-in account; local and hosted origins have separate adventures. Use Saves > Download backup / Restore a backup to transfer one deliberately.

Move with WASD/arrows, the touch joystick, or a standard gamepad. E/Space or controller A interacts; Shift/controller B runs; touch Run toggles sprint. I opens the bag, M opens the world guide. Dialogs support keyboard focus and gamepad D-pad/A/B.

## What's playable

- Seven connected areas: valley, meadow, grove, two interiors, riverbank and cavern. Repair the bridge with Emberkin and 12 wood; ask Lunamoth to open the cavern; spend five crystals to restore its beacon.
- Eight journal chapters with single-use rewards, Mara's guidance, Nell's fish request and a hidden supplies chest.
- Four distinct creature encounters. Select a travelling companion from Bag > Companions. Gathering grants 12 bond XP; treats grant 50. Every 100 XP earns a level, capped at 10. Level 2 adds one item for the companion's speciality.
- Six growing beds south of the homestead: sun turnips take 90 seconds and moon beans take three minutes. Watering reduces growing time by 35%; rain waters planted crops. Plants mature while away. Harvest at the bed, then craft inside the homestead.
- Workbench recipes for friendship treats, two seed types, tools (+1 gathered item) and a lantern. Camp upgrades improve companion idle jobs.
- A 12-minute day cycle, rain every third day, night lighting and simple time/weather-based routines for Mara and Nell.
- Original cached pixel sprites for characters, companions, houses, trees, resources, furniture and crops; proximity labels and an illustrated field guide in Menu.
- Original procedural 72 BPM background music and interaction sounds. Music is opt-in and pauses when backgrounded.

## Saves

Schema 2 lives in `mosswild-save-v2`; original v1 snapshots migrate without deleting the old key. Local autosaves happen every two seconds, after completed actions and on visibility changes. A valid recovery copy rotates at most once a minute. Imports retain a separate pre-restore copy. Future schema versions are preserved, damaged saves fall back to valid recovery, and failed writes are visible in Saves.

The hosted Worker uses the Sites dispatcher identity for every request and D1 for one save per account. Writes compare the acknowledged revision atomically; different devices must choose which adventure to keep when they diverge. Inventories are never merged. The previous cloud snapshot is retained in the database. The client syncs at startup, approximately every 30 seconds, on reconnect or on demand. Local saves continue when offline. Another tab changing the same local save pauses writes until reload. Cross-account changes also require reconciliation.

Idle gathering is calculated from the last checkpoint when the game resumes and is capped at eight hours. Fractions are preserved. This is a single-player prototype: saves are validated snapshots, not a cheat-proof economy. Device time still drives crops and idle progress. There is no combat, trading, leaderboard or purchase system.

## Development and validation

`npm install` installs development-only migration tooling. `npm test` runs movement, reachability, interactions, progression, migration/recovery, client cloud reconciliation and real-SQLite API tests. `npm run build` bundles the game and Worker into `dist/server/index.js` and copies the hosting manifest and generated migrations. Authored browser files remain directly in `dist/`; generated server and hosting outputs are ignored.

The schema is in `db/schema.ts`. Use `npm run db:generate` for new schema changes; applied migrations and metadata must remain immutable. Runtime SQL uses prepared statements. The Worker contains no Node APIs or production npm dependencies.

`node qa-v5.cjs` is a disposable localhost-only test server on port 4175. It seeds a garden fixture and uses the real API with an in-memory SQLite database and a fixed test identity. Its saves disappear on restart; do not use it for actual play or deploy it. Normal `npm run preview` remains device-only and does not impersonate an account.

Automated suites and browser checks cover phone layouts, garden actions, resource artwork, menus and cloud API behavior. Physical iOS/Android audio, suspend/resume, two-device account testing and long-session balance remain release gates; a desktop phone-size preview does not replace those checks.

## Mobile HUD pass

The exploration screen uses a compact icon/count resource strip, explorer level badge, Tasks badge and five-tab illustrated dock. Location details, saving, audio and instructions live in panels. Touch actions show one verb without keyboard/controller abbreviations. Companion world sprites are 62% of their previous dimensions, keeping them below human height. Buildings and UI share a timber/parchment/teal palette. The Map tab now opens a visual area map.
