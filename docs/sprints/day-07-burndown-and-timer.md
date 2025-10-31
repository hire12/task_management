# Sprint Day 7 (2025-10-31): D3 Sprint Burndown Trajectory & Task Stopwatch / Pomodoro

Engineering log and technical specifications for 2025-10-31.

### Milestone 1: feat(burndown): build D3 SVG SprintBurndown trajectory chart
**Timestamp**: `09:00:00`

Created components/SprintBurndown.tsx calculating ideal burn vs actual burn curves.

---

### Milestone 2: feat(burndown): calculate project velocity and projected completion date
**Timestamp**: `09:15:17`

Linear regression trajectory forecasting exact delivery date based on completion rate.

---

### Milestone 3: feat(burndown): render interactive SVG tooltips on burndown data points
**Timestamp**: `09:31:34`

Hover tooltips showing date, remaining story points, and tasks closed.

---

### Milestone 4: feat(burndown): support toggling between task count and story point metrics
**Timestamp**: `09:47:51`

Dropdown switch between raw task counts and estimated point burn.

---

### Milestone 5: feat(burndown): style ideal trajectory line with dashed slate stroke
**Timestamp**: `10:03:08`

Crisp stroke-dasharray styling for target velocity guideline.

---

### Milestone 6: feat(burndown): add sprint date range picker to customize burndown scope
**Timestamp**: `10:19:25`

Date filters allowing inspection of specific sprint cycles.

---

### Milestone 7: feat(burndown): display scope creep warnings when tasks are added mid-sprint
**Timestamp**: `10:35:42`

Visual upward spikes in burndown curve highlighting scope expansion.

---

### Milestone 8: feat(timer): build live TaskTimer stopwatch and Pomodoro component
**Timestamp**: `10:50:59`

Created components/TaskTimer.tsx with play, pause, reset, and interval tracking.

---

### Milestone 9: feat(timer): persist logged time into database on task completion
**Timestamp**: `11:06:16`

Updates task duration seconds directly into database.

---

### Milestone 10: feat(timer): add 25-minute Pomodoro focus mode with chime alert
**Timestamp**: `11:22:33`

Built-in Pomodoro cycles with work and break intervals.

---

### Milestone 11: feat(timer): display running timer badge on active Kanban task card
**Timestamp**: `11:38:50`

Pulsing amber dot and live ticking timer on card header.

---

### Milestone 12: feat(timer): allow only one running timer at a time across workspace
**Timestamp**: `11:54:07`

Starting a new timer automatically pauses any previously running task timer.

---

### Milestone 13: feat(timer): persist running timer state in localStorage across page reloads
**Timestamp**: `12:10:24`

Keeps ticking seamlessly if user navigates away or refreshes.

---

### Milestone 14: feat(timer): add manual time entry input for retroactive hour logging
**Timestamp**: `12:25:41`

Quick input to log 1h 30m without running live stopwatch.

---

### Milestone 15: feat(timer): format logged duration into human readable 2h 45m badges
**Timestamp**: `12:41:58`

Smart duration formatter formatting seconds into clean display badges.

---

### Milestone 16: feat(burndown): calculate team completion velocity per sprint week
**Timestamp**: `12:57:15`

Velocity bar chart comparing past 4 sprint performances.

---

### Milestone 17: feat(timer): show total accumulated project hours in project header
**Timestamp**: `13:13:32`

Aggregates all task durations into project-level total billable hours.

---

### Milestone 18: feat(timer): add audio chime notification on Pomodoro session complete
**Timestamp**: `13:29:49`

Synthesized web audio ding alerting user to take a 5-minute break.

---

### Milestone 19: feat(burndown): style burndown chart container with dark glass elevation
**Timestamp**: `13:45:06`

Backdrop-blur card styling matching Orbit design system.

---

### Milestone 20: feat(timer): add keyboard shortcut Alt+T to toggle stopwatch on active task
**Timestamp**: `14:00:23`

Quick hotkey to start or pause timer.

---

### Milestone 21: feat(timer): export project time sheet log to CSV
**Timestamp**: `14:16:40`

Allows downloading employee/freelancer time report for invoicing.

---

### Milestone 22: feat(burndown): add SVG area gradient beneath actual burndown curve
**Timestamp**: `14:32:57`

Linear gradient fill highlighting burned work volume.

---

### Milestone 23: feat(timer): show idle timer detection warning after 15 minutes of inactivity
**Timestamp**: `14:48:14`

Gentle popover asking user if they are still working on the task.

---

### Milestone 24: feat(burndown): support sprint milestone target markers on timeline
**Timestamp**: `15:04:31`

Flag markers showing major release milestones on burndown x-axis.

---

### Milestone 25: feat(timer): display daily time breakdown chart in Today HUD
**Timestamp**: `15:20:48`

Bar chart showing how hours were divided across projects today.

---

