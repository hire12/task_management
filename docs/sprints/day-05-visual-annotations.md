# Sprint Day 5 (2025-10-29): Visual Screenshot Bug Pin-Pointer & Canvas Annotations

Engineering log and technical specifications for 2025-10-29.

### Milestone 1: feat(schema): add annotations json field to TaskAttachment model
**Timestamp**: `09:00:00`

Schema migration adding Json? field to store pin coordinates and commentary notes.

---

### Milestone 2: chore(db): push annotations field to postgres and sync client
**Timestamp**: `09:21:17`

Pushed schema changes to database without data loss.

---

### Milestone 3: feat(ui): build ImageAnnotator component with click-to-pin canvas
**Timestamp**: `09:42:34`

Created ImageAnnotator.tsx with relative percentage coordinate calculation (x%, y%).

---

### Milestone 4: feat(ui): render numbered bug pin badges directly over screenshot preview
**Timestamp**: `10:03:51`

Vibrant circular badges with pin number and hover tooltip.

---

### Milestone 5: feat(ui): add commentary text input for each annotation pin
**Timestamp**: `10:24:08`

Modal popover when clicking a pin to enter bug description and severity.

---

### Milestone 6: feat(actions): create saveAttachmentAnnotations server action
**Timestamp**: `10:45:25`

Persists annotation pin array into TaskAttachment.annotations in PostgreSQL.

---

### Milestone 7: feat(ui): allow deleting individual annotation pins
**Timestamp**: `11:06:42`

Trash button on pin popover with instant canvas removal.

---

### Milestone 8: feat(ui): support dragging existing pins to adjust position
**Timestamp**: `11:27:59`

Mouse drag events to reposition pins with real-time percentage updates.

---

### Milestone 9: feat(ui): add color-coded severity levels to annotation pins
**Timestamp**: `11:48:16`

Red for critical bugs, orange for warnings, blue for design feedback.

---

