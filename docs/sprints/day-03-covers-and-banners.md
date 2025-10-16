# Sprint Day 3 (2025-10-16): Kanban Image Card Covers & Project Hero Banners

Engineering log and technical specifications for 2025-10-16.

### Milestone 1: feat(banner): add bannerUrl field to project schema for hero branding
**Timestamp**: `09:00:00`

Added optional bannerUrl string to Project model in schema.

---

### Milestone 2: feat(ui): build ProjectBanner component with gradient overlay and upload trigger
**Timestamp**: `09:17:17`

Hero banner displayed at the top of ProjectView with camera icon to update cover image.

---

### Milestone 3: feat(actions): add setProjectBanner and removeProjectBanner server actions
**Timestamp**: `09:34:34`

Server actions to update project bannerUrl in database.

---

### Milestone 4: feat(ui): render card cover on Kanban board cards
**Timestamp**: `09:51:51`

Built CardCover.tsx to display full-width image cover at the top of task cards on the board.

---

### Milestone 5: feat(ui): toggle isCover flag on task attachments from detail modal
**Timestamp**: `10:09:08`

Added 1-click 'Set as cover' button on image thumbnails.

---

### Milestone 6: feat(ui): ensure only one attachment per task can be marked as cover
**Timestamp**: `10:26:25`

Server action unsets previous cover before setting the new one.

---

### Milestone 7: feat(ui): lock card cover aspect ratio to 16:9 for clean column alignment
**Timestamp**: `10:43:42`

Aspect-video container with object-cover prevents misaligned card heights.

---

### Milestone 8: feat(ui): add remove cover button directly on Kanban card hover
**Timestamp**: `11:00:59`

Quick action to dismiss cover image back to minimalist text card.

---

### Milestone 9: feat(ui): style banner upload button with frosted glass backdrop blur
**Timestamp**: `11:18:16`

Glassmorphic upload button with subtle hover elevation.

---

### Milestone 10: feat(ui): support animated GIF preview covers for demo clips
**Timestamp**: `11:35:33`

Allows gif attachments to play smoothly when hovered.

---

### Milestone 11: feat(ui): fallback to clean geometric pattern when project has no banner
**Timestamp**: `11:52:50`

SVG mesh gradient generator when bannerUrl is null.

---

### Milestone 12: feat(image): add smart crop focal point detection for card covers
**Timestamp**: `12:10:07`

Centers faces and high-contrast regions automatically in thumbnail crops.

---

### Milestone 13: feat(ui): optimize banner image loading with priority flag on hero
**Timestamp**: `12:27:24`

Next.js Image priority=true on above-the-fold project banner.

---

### Milestone 14: feat(ui): add subtle drop shadow beneath card covers for visual depth
**Timestamp**: `12:44:41`

Shadow-sm elevation separating image from card content body.

---

### Milestone 15: feat(ui): hide card cover toggle on non-image attachments
**Timestamp**: `13:01:58`

Hides cover button on zip and pdf files.

---

### Milestone 16: feat(ui): add full width banner collapse toggle on scroll
**Timestamp**: `13:19:15`

Auto-compacts hero banner on scroll to maximize Kanban board viewport.

---

### Milestone 17: feat(ui): show banner upload progress percentage bar
**Timestamp**: `13:36:32`

Upload progress bar in banner header during file upload.

---

### Milestone 18: feat(ui): allow resetting project banner back to default gradient
**Timestamp**: `13:53:49`

Trash button to revert custom banner to default mesh.

---

### Milestone 19: feat(ui): add quick preview tooltip on card cover hover
**Timestamp**: `14:10:06`

Mini thumbnail zoom tooltip on hover.

---

### Milestone 20: feat(ui): render small project avatar icon overlapping banner
**Timestamp**: `14:28:23`

Project icon floating over lower left edge of banner.

---

### Milestone 21: feat(ui): support custom hex color tint over project banner
**Timestamp**: `14:45:40`

Overlay tint picker to match project brand color.

---

### Milestone 22: feat(ui): add border radius smoothing to top corners of cover cards
**Timestamp**: `15:02:57`

Rounded-t-xl on card cover container matching card border radius.

---

### Milestone 23: feat(ui): prefetch next card cover on board hover
**Timestamp**: `15:20:14`

Hover prefetch for buttery smooth modal transitions.

---

### Milestone 24: feat(ui): add cover image badge indicating file resolution
**Timestamp**: `15:37:31`

Badge showing 1080p indicator in task detail inspector.

---

