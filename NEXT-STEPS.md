# Mosswild: after the frontier release

Updated 20 September 2026.

## Delivered

- Five connected frontier regions, regional NPC requests and five permanent restoration projects.
- Fresh-gather commissions, reputation ranks and 5/20/60-minute companion expeditions.
- Visual inventory, task, companion, recipe and region panels; refreshed bottom dock.
- Four-direction traveller, hair/coat/hat options and visible repaired landmarks.
- Four longer procedural scores, automatic area selection and separate ambience controls.
- Additive save migration and tests for routes, one-time costs/rewards and expedition idle overlap.

## Next priorities

1. Playtest progression on established saves over several sessions. Requests currently repeat regional gathering recipes; add farming, discovery and crafting objectives based on observed pacing.
2. Deepen each region with unique interiors, discoveries and activities. Regions have distinct materials, palettes, NPCs and landmarks but share a simple trail layout. Add bespoke geography and responsive NPC portraits/dialogue.
3. Test on physical iOS/Android devices: touch controls, safe areas, audio quality, silent mode, interruptions and suspend/resume. Browser viewport testing does not replace phone testing.
4. Connect a separately hosted authenticated save API once a backend account is selected. GitHub Pages currently uses device autosaves, recovery and export/import; it cannot execute the former Sites Worker. Preserve conflict selection, offline use and account isolation.
5. Add installable/offline PWA support after update/save compatibility is defined. Refactor global override chains into modules before another large content expansion.

## Deployment

Push tested changes to main; GitHub Actions publishes dist to https://zestybytes.github.io/mosswild/. Storage does not transfer between site addresses: export from the former site and import on Pages.
