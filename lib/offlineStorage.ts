/**
 * Offline-first task queue and cache manager.
 */

export interface QueuedSyncAction {
  id: string;
  action: "create" | "update" | "delete";
  entity: "task" | "project";
  payload: any;
  createdAt: number;
}

class OfflineStorageManager {
  private queueKey = "orbit_offline_sync_queue";
  private cacheKeyPrefix = "orbit_cache_";

  getQueue(): QueuedSyncAction[] {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem(this.queueKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  enqueue(item: Omit<QueuedSyncAction, "id" | "createdAt">) {
    const queue = this.getQueue();
    const entry: QueuedSyncAction = {
      ...item,
      id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
    };
    queue.push(entry);
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  dequeue(id: string) {
    const queue = this.getQueue().filter((q) => q.id !== id);
    localStorage.setItem(this.queueKey, JSON.stringify(queue));
  }

  cacheEntity(key: string, data: any) {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(`${this.cacheKeyPrefix}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn("Local cache full:", e);
    }
  }

  getCachedEntity<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(`${this.cacheKeyPrefix}${key}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }
}

export const offlineStorage = new OfflineStorageManager();
