# Game art

The final pixel-world renderer replaces older cottages, orchard trees, NPCs and landmarks. Terrain and cottages use the same 32px tile grid. Collision footprints and doors are unchanged.

Original PNGs are retained in dist/assets. PixelAtlas prepares transparent frames without smoothing. The artbook.html gallery previews and downloads prepared sheets:

| Sheet | Grid | Cell size |
| --- | --- | --- |
| Traveller | 4 by 2 | 64 by 96 |
| Companions | 6 by 3 | 64 by 64 |
| NPCs | 4 by 2, last blank | 64 by 96 |
| Overworld | 8 by 4 | 32 by 32 |
| Landmarks | 3 by 5 | 120 by 105 |

NPC source rectangles exclude neighbouring props. Explicit landmark row guides account for uneven source spacing. Player columns are front, side, three-quarter and back; rows are idle then walking. Companion pairs are front and side. Landmark columns are broken, mid-repair and restored, selected by regional quest stage and restoration completion.

Humans render at 38px high; companions at 22px. Existing handmade crops, furniture and gameplay markers remain. Classic player appearance remains selectable. Original PNG dimensions differ from the prepared download grids.

Validation covers transparency, populated frames, walking directions and all landmark states alongside progression/save tests. Browser review checks cottage composition and the asset gallery.
