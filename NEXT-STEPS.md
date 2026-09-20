# Mosswild — next development plan

Updated 20 September 2026. Code: C:\Users\Jamie Bassett\Dev\mosswild.

## Delivered in this iteration

The first adventure now has eight rewarded chapters, companions have levels and specialities, the garden produces crafting ingredients, and the world has time/weather routines. The art pass replaces abstract blocks with distinct resource and character silhouettes and adds a field guide.

Save foundations are implemented: v1 migration, visible local autosaves, recovery, import/export, authenticated D1 cloud snapshots, revision conflicts, cross-account reconciliation and protection against restoring over a newer adventure silently. Cloud remains a single-player backup system, not server-authoritative progression.

## Next: playtest one complete adventure

1. Play a fresh adventure on a real phone, from Mara through the cavern beacon. Record where the route, interaction or reward is unclear. Target a satisfying 20–30 minute opening; its duration has not yet been validated with players.
2. Check every object at actual phone size. Tune silhouettes, contrast and collision footprints before adding more decorative detail. Give Nell and Mara individual animations and add clearer tool-swing/fishing animations.
3. Tune the economy: crop times, treat costs, bond XP, resource respawn, idle output and bridge cost. Check that active play feels worthwhile beside eight-hour away rewards. Keep resources useful after the beacon.

## Save release gates

- Complete an actual signed-in phone → desktop → phone journey, including both devices offline and conflicting progress. Confirm the discarded branch has been downloaded if both adventures are wanted.
- Exercise mobile browser termination, restricted storage, storage quota, airplane mode, authentication expiry and account switching. Verify the player sees the correct local/cloud status in each case.
- Add a browsable cloud history rather than only the current and immediately previous server snapshot, plus dated local recovery slots.
- Move local persistence to transactional IndexedDB if save size/content grows. Add explicit save identifiers, dirty-state writes and better conflict comparisons (time, area and completed chapters).
- Before a shared economy or purchases, move rewards and clock checks to authoritative server transactions. Do not add multiplayer trading on top of client snapshots.

## Following content update

- Companion abilities beyond level 2: meaningful routes or resource actions, not just higher numbers. Add bond moments and individual requests.
- A second quest chapter with a new destination, one new companion and one new farming/crafting loop. Build a distinct destination rather than enlarging empty terrain.
- More authored NPC schedules, dialogue choices and visible environmental responses to quests.
- Sound mixing and longer musical variation. Test phone speakers, headphones, silent-mode behavior and interruptions.

## Mobile release preparation

Test iOS Safari and Android Chrome at 320–430 px portrait and landscape, using actual touch input and low-power devices. Check safe areas, thumb reach, controller focus, reduced motion, contrast, background audio and memory usage. Then add installable PWA/offline assets with version-aware updates so old clients cannot overwrite newer save schemas.

Refactor the accumulating global function extensions into explicit world, render, input, progression and persistence modules before substantially expanding content. Preserve the current test coverage while doing so.
