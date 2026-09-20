# Mosswild: next game and UX milestones

Updated 20 September 2026 after the move to GitHub Pages.

## Current release and deployment

- Live game: https://zestybytes.github.io/mosswild/
- Development: C:\Users\Jamie Bassett\Dev\mosswild. Push finished work to main; GitHub Actions tests and publishes dist/.
- Keep the existing top resource HUD. The recent icon-led menu changes are already on main and should be extended, not replaced wholesale.
- The initial eight chapters are introductory content. Completing them currently leaves no substantial long-term goal.
- The draft frontier-world.js and save fields are scaffolding, not a completed expansion. They are intentionally not loaded until the region interactions, progression and tests exist together.
- GitHub Pages runs static files, not the former authenticated Worker. This release uses local autosaves, recovery and backup export/import. Separate authenticated hosting is required to reconnect cloud saves. Moving to a new address does not transfer browser storage; export on the old address and import on the new one.

## 1. Build a reason to return

Target loop: explore → bring back something distinctive → restore or upgrade a place → unlock a new route or ability → send companions on a useful job → return to spend the result.

Deliver three linked systems together:

- Regional restoration projects with visible stages, item requirements and permanent rewards. Existing wood/berries/coins should help, but a new exploration material prevents large stockpiles from completing everything immediately.
- NPC commissions that ask for several kinds of activity, increase local reputation and unlock recipes or services. Keep one clear tracked objective; avoid endless copies of the same gathering request.
- Companion expeditions with short, medium and long routes. Show duration, expected rewards and the companion committed. Prevent a dispatched companion from simultaneously earning the same idle job rewards. Allow completed trips to wait for collection without penalties.

Acceptance: an established save has at least three worthwhile goals after the old finale, resources have a clear purpose, and returning after an hour creates a meaningful decision. Measure this in playtesting rather than assuming more quest text makes the game longer.

## 2. Expand into three distinctive regions

| Region | Identity | Character and progression |
| --- | --- | --- |
| Bramble Orchard | Fruit trees, overgrown gardens, herb collecting | Tessa restores the nursery; growing and delivery requests |
| Copper Highlands | Cliffs, mine workings, ore and shortcuts | Rowan repairs a lift; equipment crafting and surveying |
| Fernwater Marsh | Boardwalks, reeds, pools and unusual wildlife | Iris restores wetland trails; fishing and companion abilities |

Each needs a memorable landmark, an enterable building or substantial activity, a named NPC with a service, several discovery points, a region material and a visible restoration project. Design routes around those purposes, then size the map. Tideglass Coast and Starlight Plateau can follow once the first three prove fun.

Acceptance: all exits and interactions are reachable; locked routes clearly state the requirement; the map shows discovered and undiscovered destinations; saves remain valid after terrain changes.

## 3. Finish the menu interaction design

- Bag: separate inventory from companion jobs. Use a compact item grid with counts, category tabs and an item detail card on selection. Keep Collect visible in a sticky footer.
- Tasks: default to the current objective and its progress/reward. Use Story, Requests and Projects tabs. Collapse completed chapters into a history view.
- Friends: individual portraits, bond bars, ability badges and a clear travelling/working/away state. Put Feed, Travel and Assign beside the selected friend.
- Crafting: recipe grid, ingredient icons, owned/required counts and a preview of what the result does. Keep unavailable recipes readable without a paragraph of instructions.
- Bottom dock: use the same icon weight, spacing and selected state throughout; add small useful notifications for ready supplies and completed requests. Do not permanently highlight Camp when another panel is open.
- Panels: sticky close/header and primary action; internal scrolling; restore focus when dismissed; comfortable touch targets at 320 px width. Keep long help text behind an information button.

Acceptance: open Bag and collect supplies without scrolling; identify the next task in one glance; switch a companion job without leaving its card; no controls overlap in portrait or landscape.

## 4. Character and world personality

Replace the stiff current traveller with a coherent four-direction sprite: clearer head/body proportions, readable hair and coat, softer walking frames and a distinct backpack silhouette. Add a small free appearance selector with a few hair/outfit choices and an optional hat. Match the sprite palette and outline weight to companions and NPCs.

Give NPCs recognisable roles, portraits, daily destinations and short dialogue that responds to progress. Show repaired structures, working equipment, planted gardens and companion activity in the world so achievements change what the player sees.

Acceptance: the character reads clearly at actual phone size from all directions, and users can recognise each NPC without a permanent name label.

## 5. Replace the short music loop

Create separate village, forest, water and cavern themes with longer arrangements, sparse variations and breathing space. Crossfade on area changes; add water/wind/bird ambience without constant sound. Offer music and ambience levels separately, plus a next-track/quiet option.

Acceptance: listen on actual phone speakers and headphones for a sustained session. Verify backgrounding, audio unlock, silent mode and interruptions; automated AudioContext checks alone do not prove the music is pleasant.

## 6. Release foundations

Reconnect authenticated cloud storage through a separately hosted API before presenting cloud backup as available on GitHub Pages. Include per-account access checks, revision conflicts, recovery history and a migration path from the former site. Preserve offline play and device backups.

Add installable/offline PWA behavior only after update and save-schema compatibility are defined. Extract the current chain of global function overrides into world, input, render, UI, progression and persistence modules while preserving tests; this will make additional regions much safer to ship.

## Suggested next release

Ship Bramble Orchard, Tessa's nursery project, a small commission system, companion expeditions and the Bag/Tasks/Friends redesign as one complete progression loop. Include the improved character and varied soundtrack in the same release if their real-device review passes. Add Highlands and Marsh in the following content update rather than exposing unfinished terrain.
