# Sprint Day 1 (2025-10-12): Task Detail Modal, Attachment Schema & Image Compression

Engineering log and technical specifications for 2025-10-12.

### Milestone 1: feat(db): give tasks eyes by adding attachment models to schema
**Timestamp**: `09:00:00`

Tasks were basically blind text notes before this. Adding TaskAttachment with width, height, mime, and cover support so we can attach full screenshots and mockups.

---

### Milestone 2: chore(db): sync prisma client with new image attachment superpowers
**Timestamp**: `09:40:17`

Ran prisma generate so the client types reflect the new attachments relation.

---

### Milestone 3: feat(api): build file upload endpoint that actually rejects 50MB garbage
**Timestamp**: `10:21:34`

Added /api/upload route with size validation, type whitelisting (png, jpg, webp, svg), and disk saving into public/uploads.

---

### Milestone 4: feat(lib): crush heavy screenshots into featherweight WebP before upload
**Timestamp**: `11:02:51`

Sharp pipeline that resizes giant 4K screen snips and crushes them into snappy WebP so boards don't crawl.

---

### Milestone 5: feat(types): tell TypeScript tasks now have attachments so it stops whining
**Timestamp**: `11:42:08`

Updated FullTask interface with optional attachments array.

---

### Milestone 6: feat(db): load attachments alongside tasks so images actually show up
**Timestamp**: `12:23:25`

Included attachments in project tasks query.

---

### Milestone 7: feat(actions): add server actions to delete files and toggle kanban covers
**Timestamp**: `13:04:42`

deleteAttachment and toggleAttachmentCover server actions in app/actions/attachments.ts.

---

### Milestone 8: feat(ui): build TaskDetailModal so we can finally read long descriptions
**Timestamp**: `13:45:59`

Built modal overlay with full description reader, status pills, subtasks list, and attachment gallery.

---

### Milestone 9: feat(ui): add live inline editor for task specs and descriptions
**Timestamp**: `14:25:16`

Users can click directly on the description to edit or write notes.

---

### Milestone 10: feat(ui): embed image dropzone and screenshot gallery into task modal
**Timestamp**: `15:06:33`

Drag and drop zone right inside task modal with grid preview of attached images.

---

### Milestone 11: feat(ui): hook up card click to task modal without fighting drag-and-drop
**Timestamp**: `15:47:50`

Clicking anywhere on a Kanban card opens the inspector, while drag-and-drop still works smoothly.

---

### Milestone 12: feat(ui): show tiny image paperclip counters on kanban cards
**Timestamp**: `16:27:07`

Added paperclip badge with attachment count so you know at a glance which tasks have mockups.

---

### Milestone 13: feat(ui): let Escape key and backdrop clicks dismiss the task modal like normal software
**Timestamp**: `17:08:24`

Added keyboard Escape listener and backdrop click handler.

---

