import { getErrorMessage } from '@/utils/error-handler';
/**
 * Event Bus Implementation
 * Handles event-driven communication between components
 */

import { AppEvent } from './events';
import { logger } from '@/utils/logger';

export type EventCallback<T = any> = (data: T) => void | Promise<void>;

export interface EventListener<T = any> {
  callback: EventCallback<T>;
  once?: boolean;
  priority?: number;
  id?: string;
}

export interface EventSubscription {
  unsubscribe: () => void;
  event: string;
  listenerId: string;
}

export interface EventMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  listenersByEvent: Record<string, number>;
  averageListenersPerEvent: number;
}

/**
 * Event Bus Class
 * Manages event listeners and event emission
 */
export class EventBus {
  private listeners = new Map<string, EventListener[]>();
  private maxListeners = 100;
  private metrics: EventMetrics = {
    totalEvents: 0,
    eventsByType: {},
    listenersByEvent: {},
    averageListenersPerEvent: 0,
  };
  private listenerIdCounter = 0;

  /**
   * Add event listener
   */
  on<T = any>(
    event: string,
    callback: EventCallback<T>,
    options?: { once?: boolean; priority?: number; id?: string }
  ): EventSubscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventListeners = this.listeners.get(event)!;

    // Check max listeners limit
    if (eventListeners.length >= this.maxListeners) {
      logger.warn(`Event '${event}' has reached the maximum number of listeners`, { 
        event, 
        maxListeners: this.maxListeners 
      });
      return { unsubscribe: () => {}, event, listenerId: '' };
    }

    const listenerId = options?.id || `listener_${++this.listenerIdCounter}`;
    const listener: EventListener<T> = {
      callback,
      once: options?.once || false,
      priority: options?.priority || 0,
      id: listenerId,
    };

    eventListeners.push(listener);

    // Sort by priority (higher priority first)
    eventListeners.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    // Update metrics
    this.updateMetrics();

    return {
      unsubscribe: () => this.off(event, callback),
      event,
      listenerId,
    };
  }

  /**
   * Add one-time event listener
   */
  once<T = any>(event: string, callback: EventCallback<T>, priority?: number): EventSubscription {
    return this.on(event, callback, { once: true, priority: priority || 0 });
  }

  /**
   * Remove event listener
   */
  off<T = any>(event: string, callback: EventCallback<T>): boolean {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return false;

    const index = eventListeners.findIndex(listener => listener.callback === callback);
    if (index > -1) {
      eventListeners.splice(index, 1);

      // Clean up empty event arrays
      if (eventListeners.length === 0) {
        this.listeners.delete(event);
      }

      // Update metrics
      this.updateMetrics();
      return true;
    }

    return false;
  }

  /**
   * Remove event listener by ID
   */
  offById(event: string, listenerId: string): boolean {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return false;

    const index = eventListeners.findIndex(listener => listener.id === listenerId);
    if (index > -1) {
      eventListeners.splice(index, 1);

      // Clean up empty event arrays
      if (eventListeners.length === 0) {
        this.listeners.delete(event);
      }

      // Update metrics
      this.updateMetrics();
      return true;
    }

    return false;
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }

    // Update metrics
    this.updateMetrics();
  }

  /**
   * Emit event to all listeners
   */
  async emit<T = any>(event: string, data: T): Promise<void> {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }

    // Update metrics
    this.metrics.totalEvents++;
    this.metrics.eventsByType[event] = (this.metrics.eventsByType[event] || 0) + 1;

    // Create a copy of listeners to avoid issues with modifications during iteration
    const listenersToCall = [...eventListeners];
    const listenersToRemove: EventListener[] = [];

    for (const listener of listenersToCall) {
      try {
        await listener.callback(data);

        // Mark one-time listeners for removal
        if (listener.once) {
          listenersToRemove.push(listener);
        }
      } catch (error) {
        logger.error(`Error in event listener for '${event}'`, { error: getErrorMessage(error), event });
      }
    }

    // Remove one-time listeners
    for (const listener of listenersToRemove) {
      this.off(event, listener.callback);
    }
  }

  /**
   * Emit event synchronously
   */
  emitSync<T = any>(event: string, data: T): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }

    // Update metrics
    this.metrics.totalEvents++;
    this.metrics.eventsByType[event] = (this.metrics.eventsByType[event] || 0) + 1;

    // Create a copy of listeners to avoid issues with modifications during iteration
    const listenersToCall = [...eventListeners];
    const listenersToRemove: EventListener[] = [];

    for (const listener of listenersToCall) {
      try {
        listener.callback(data);

        // Mark one-time listeners for removal
        if (listener.once) {
          listenersToRemove.push(listener);
        }
      } catch (error) {
        logger.error(`Error in event listener for '${event}'`, { error: getErrorMessage(error), event });
      }
    }

    // Remove one-time listeners
    for (const listener of listenersToRemove) {
      this.off(event, listener.callback);
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    const eventListeners = this.listeners.get(event);
    return eventListeners ? eventListeners.length : 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }

  /**
   * Set maximum number of listeners per event
   */
  setMaxListeners(max: number): void {
    this.maxListeners = max;
  }

  /**
   * Get maximum number of listeners per event
   */
  getMaxListeners(): number {
    return this.maxListeners;
  }

  /**
   * Check if event has listeners
   */
  hasListeners(event: string): boolean {
    return this.listenerCount(event) > 0;
  }

  /**
   * Create a promise that resolves when an event is emitted
   */
  waitFor<T = any>(event: string, timeout?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;

      const cleanup = () => {
        this.off(event, listener);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      const listener = (data: T) => {
        cleanup();
        resolve(data);
      };

      this.once(event, listener);

      if (timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Event '${event}' timeout after ${timeout}ms`));
        }, timeout);
      }
    });
  }

  /**
   * Create a promise that resolves when an event is emitted with a condition
   */
  waitForCondition<T = any>(
    event: string,
    condition: (data: T) => boolean,
    timeout?: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout | undefined;

      const cleanup = () => {
        this.off(event, listener);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };

      const listener = (data: T) => {
        if (condition(data)) {
          cleanup();
          resolve(data);
        }
      };

      this.on(event, listener);

      if (timeout) {
        timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error(`Event '${event}' condition timeout after ${timeout}ms`));
        }, timeout);
      }
    });
  }

  /**
   * Emit typed application event
   */
  async emitAppEvent<T extends AppEvent>(event: T): Promise<void> {
    await this.emit(event.type, event);
  }

  /**
   * Emit typed application event synchronously
   */
  emitAppEventSync<T extends AppEvent>(event: T): void {
    this.emitSync(event.type, event);
  }

  /**
   * Get event metrics
   */
  getMetrics(): EventMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalEvents: 0,
      eventsByType: {},
      listenersByEvent: {},
      averageListenersPerEvent: 0,
    };
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    const events = Array.from(this.listeners.keys());
    const totalListeners = Array.from(this.listeners.values()).reduce(
      (sum, listeners) => sum + listeners.length,
      0
    );

    this.metrics.listenersByEvent = {};
    events.forEach(event => {
      this.metrics.listenersByEvent[event] = this.listenerCount(event);
    });

    this.metrics.averageListenersPerEvent = events.length > 0 ? totalListeners / events.length : 0;
  }

  /**
   * Get detailed event information
   */
  getEventInfo(event: string): {
    listenerCount: number;
    listeners: Array<{
      id?: string;
      priority: number;
      once: boolean;
    }>;
  } | null {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) return null;

    return {
      listenerCount: eventListeners.length,
      listeners: eventListeners.map(listener => ({
        id: listener.id || undefined,
        priority: listener.priority || 0,
        once: listener.once || false,
      })),
    };
  }

  /**
   * Create event middleware
   */
  createMiddleware<T = any>(
    event: string,
    middleware: (data: T, next: () => void) => void | Promise<void>
  ): EventSubscription {
    return this.on(event, async (data: T) => {
      await new Promise<void>(resolve => {
        middleware(data, resolve);
      });
    });
  }

  /**
   * Batch emit multiple events
   */
  async batchEmit(events: Array<{ event: string; data: any }>): Promise<void> {
    await Promise.all(events.map(({ event, data }) => this.emit(event, data)));
  }

  /**
   * Create event filter
   */
  createFilter<T = any>(event: string, filter: (data: T) => boolean): EventSubscription {
    return this.on(event, (data: T) => {
      if (filter(data)) {
        this.emit(`${event}.filtered`, data);
      }
    });
  }
}

// Export singleton instance
export const eventBus = new EventBus();
