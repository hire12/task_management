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

