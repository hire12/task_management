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

