# Sprint Day 6 (2025-10-30): Keyboard-First Vim Chords & Client Undo Stack

Engineering log and technical specifications for 2025-10-30.

### Milestone 1: feat(undo): create client-side in-memory UndoManager stack
**Timestamp**: `09:00:00`

Built lib/undoStack.ts with push, pop, undo, redo, and state subscriptions.

---

### Milestone 2: feat(undo): record task status changes into undo stack
**Timestamp**: `09:13:17`

Dragging a task between columns registers an inverse status update action.

---

### Milestone 3: feat(undo): record task deletions into undo stack for instant recovery
**Timestamp**: `09:27:34`

Deleting a task pushes recovery snapshot allowing immediate Cmd+Z restore.

---

### Milestone 4: feat(shortcuts): add global Cmd+Z / Ctrl+Z keyboard listener for undo
**Timestamp**: `09:40:51`

Global keydown listener calling undoManager.undo() when focused outside inputs.

---

### Milestone 5: feat(shortcuts): add Cmd+Shift+Z / Ctrl+Y keyboard listener for redo
**Timestamp**: `09:54:08`

Redo support traversing forward in action history.

---

### Milestone 6: feat(ui): add floating undo toast notification with 5s countdown timer
**Timestamp**: `10:07:25`

Toast pill at bottom-right showing 'Task deleted · Undo (Cmd+Z)' with progress bar.

---

### Milestone 7: feat(vim): add vim two-key chords for lightning navigation
**Timestamp**: `10:21:42`

G then T jumps to Today HUD, G then P jumps to Projects, G then B jumps to Board.

---

### Milestone 8: feat(vim): add hotkey C to summon new task modal from anywhere
**Timestamp**: `10:35:59`

Pressing C outside form inputs opens quick task creation modal.

---

### Milestone 9: feat(vim): add hotkey / to focus search palette
**Timestamp**: `10:48:16`

Pressing slash focuses the global task and project search bar.

---

### Milestone 10: feat(vim): add hotkey ? to open keyboard shortcuts help cheat sheet
**Timestamp**: `11:02:33`

Pressing question mark summons interactive modal displaying all hotkeys.

---

### Milestone 11: feat(ui): build KeyboardShortcutsHelp modal with categorized shortcut cards
**Timestamp**: `11:15:50`

Categorized into Navigation, Board, Task Actions, and Editing.

---

### Milestone 12: feat(vim): add hotkey J and K to navigate between tasks in column
**Timestamp**: `11:29:07`

Vim arrow keys to select next and previous task card on board.

---

### Milestone 13: feat(vim): add hotkey X to toggle complete on selected task
**Timestamp**: `11:42:24`

Instantly marks selected task DONE or moves back to TODO.

---

### Milestone 14: feat(vim): add hotkey E to open edit inspector on selected task
**Timestamp**: `11:56:41`

Enter or E opens TaskDetailModal for the currently focused card.

---

### Milestone 15: feat(shortcuts): disable hotkeys automatically when typing inside inputs or textareas
**Timestamp**: `12:10:58`

Checks document.activeElement tag to prevent triggering shortcuts while typing.

---

### Milestone 16: feat(ui): render keyboard shortcut badges (Kbd) across navigation items
**Timestamp**: `12:23:15`

Visual hint pills showing shortcut keys in sidebar and menus.

---

### Milestone 17: feat(undo): cap undo stack size at 50 operations to prevent memory leaks
**Timestamp**: `12:37:32`

Circular buffer trimming oldest actions beyond 50 entries.

---

### Milestone 18: feat(undo): support undoing subtask checklist toggles
**Timestamp**: `12:50:49`

Toggling checklist items records inverse state in undo stack.

---

### Milestone 19: feat(undo): support undoing task priority changes
**Timestamp**: `13:04:06`

Changing task priority pushes rollback command to undo history.

---

### Milestone 20: feat(vim): add hotkey Escape to blur inputs and close active modals
**Timestamp**: `13:17:23`

Universal Escape key handling across all UI layers.

---

### Milestone 21: feat(ui): style Kbd keyboard shortcut chips with tactile keycap border
**Timestamp**: `13:31:40`

Tactile 3D keycap look with border-b-2 and subtle shadow.

---

### Milestone 22: feat(shortcuts): add hotkey 1 to 5 to quickly set task priority
**Timestamp**: `13:45:57`

Pressing 1 sets Low, 2 sets Medium, 3 sets High, 4 sets Urgent.

---

### Milestone 23: feat(shortcuts): add hotkey M to open assignee menu on active task
**Timestamp**: `13:58:14`

Quick menu popover to assign task without using mouse.

---

### Milestone 24: feat(shortcuts): add hotkey D to set task due date
**Timestamp**: `14:12:31`

Opens date picker popover on selected task card.

---

### Milestone 25: feat(shortcuts): add hotkey Backspace to delete selected task with confirm
**Timestamp**: `14:25:48`

Prompts quick confirmation or toast with undo option.

---

### Milestone 26: feat(ui): add visual focus ring around currently keyboard-selected card
**Timestamp**: `14:39:05`

Vibrant 2px outline-accent ring indicating active keyboard focus.

---

### Milestone 27: feat(shortcuts): add hotkey Space to preview task attachments in quick lightbox
**Timestamp**: `14:52:22`

Spacebar opens first attachment in lightbox preview.

---

### Milestone 28: feat(shortcuts): add hotkey Tab to cycle between Kanban columns
**Timestamp**: `15:06:39`

Tab and Shift+Tab jump keyboard focus across board columns.

---

### Milestone 29: feat(shortcuts): add hotkey N to create new column on board
**Timestamp**: `15:20:56`

Hotkeys for column management on active project boards.

---

### Milestone 30: feat(shortcuts): add hotkey F to open filter toolbar
**Timestamp**: `15:33:13`

Pressing F toggles task search and filter bar visibility.

---

### Milestone 31: feat(shortcuts): add hotkey P to toggle project banner collapse
**Timestamp**: `15:47:30`

Toggles hero banner between expanded and minimalist view.

---

### Milestone 32: feat(undo): clear redo stack when a new operation is initiated
**Timestamp**: `16:00:47`

Standard undo/redo branch truncation semantics.

---

### Milestone 33: feat(ui): add audio click feedback option for keyboard power users
**Timestamp**: `16:14:04`

Optional subtle mechanical click sound on shortcut triggers.

---

