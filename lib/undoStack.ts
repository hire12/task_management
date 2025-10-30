/**
 * In-memory client undo stack for instant rollback of destructive actions.
 */

export interface UndoableAction {
  id: string;
  description: string;
  undo: () => Promise<void> | void;
  timestamp: number;
}

class UndoManager {
  private stack: UndoableAction[] = [];
  private listeners: ((action: UndoableAction | null) => void)[] = [];

  push(action: Omit<UndoableAction, "id" | "timestamp">) {
    const item: UndoableAction = {
      ...action,
      id: `undo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };
    this.stack.push(item);
    if (this.stack.length > 50) this.stack.shift();
    this.notify(item);
  }

  async pop(): Promise<boolean> {
    const action = this.stack.pop();
    if (!action) return false;
    try {
      await action.undo();
      this.notify(null);
      return true;
    } catch (err) {
      console.error("Failed to undo action:", err);
      return false;
    }
  }

  subscribe(listener: (action: UndoableAction | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(action: UndoableAction | null) {
    this.listeners.forEach((l) => l(action));
  }
}

export const undoManager = new UndoManager();
