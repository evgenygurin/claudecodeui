import { getErrorMessage } from '@/utils/error-handler';
/**
 * Advanced Cache Service
 * Implements LRU cache with hit/miss rate tracking and TTL support
 */

import { logger } from '@/utils/logger';
import { createError } from '@/utils/error-handler';

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl?: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  missRate: number;
  totalRequests: number;
  totalSize: number;
  entryCount: number;
  evictions: number;
  averageAccessTime: number;
}

export interface CacheOptions {
  maxSize: number;
  maxAge?: number; // Default TTL in milliseconds
  maxEntries?: number;
  enableStats?: boolean;
  enablePersistence?: boolean;
  persistenceKey?: string;
}

export class CacheService<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private accessOrder: string[] = [];
  private stats: CacheStats;
  private options: Required<CacheOptions>;

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = {
      maxSize: 50 * 1024 * 1024, // 50MB default
      maxAge: 5 * 60 * 1000, // 5 minutes default
      maxEntries: 1000,
      enableStats: true,
      enablePersistence: false,
      persistenceKey: 'cache_data',
      ...options,
    };

    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      missRate: 0,
      totalRequests: 0,
      totalSize: 0,
      entryCount: 0,
      evictions: 0,
      averageAccessTime: 0,
    };

    if (this.options.enablePersistence) {
      this.loadFromPersistence();
    }

    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Get value from cache
   */
  get(key: string): T | null {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.recordMiss();
        return null;
      }

      // Check if entry has expired
      if (this.isExpired(entry)) {
        this.delete(key);
        this.recordMiss();
        return null;
      }

      // Update access tracking
      this.updateAccess(key, entry);
      this.recordHit();
      
      const accessTime = performance.now() - startTime;
      this.updateAverageAccessTime(accessTime);
      
      logger.debug('Cache hit', { key, accessTime });
      return entry.value;
    } catch (error) {
      logger.error('Cache get error', { error: getErrorMessage(error), key });
      this.recordMiss();
      return null;
    }
  }

  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    try {
      const now = Date.now();
      const entrySize = this.calculateSize(value);
      const entryTTL = ttl || this.options.maxAge;

      // Check if we need to evict entries
      this.ensureSpace(entrySize);

      const entry: CacheEntry<T> = {
        key,
        value,
        timestamp: now,
        ttl: entryTTL,
        accessCount: 0,
        lastAccessed: now,
        size: entrySize,
      };

      // Remove existing entry if it exists
      if (this.cache.has(key)) {
        this.delete(key);
      }

      this.cache.set(key, entry);
      this.accessOrder.push(key);
      this.stats.totalSize += entrySize;
      this.stats.entryCount++;

      logger.debug('Cache set', { key, size: entrySize, ttl: entryTTL });
    } catch (error) {
      logger.error('Cache set error', { error: getErrorMessage(error), key });
      throw createError(`Failed to set cache entry: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    try {
      const entry = this.cache.get(key);
      if (!entry) {
        return false;
      }

      this.cache.delete(key);
      this.removeFromAccessOrder(key);
      this.stats.totalSize -= entry.size;
      this.stats.entryCount--;

      logger.debug('Cache delete', { key });
      return true;
    } catch (error) {
      logger.error('Cache delete error', { error: getErrorMessage(error), key });
      return false;
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    try {
      this.cache.clear();
      this.accessOrder = [];
      this.stats.totalSize = 0;
      this.stats.entryCount = 0;
      
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Cache clear error', { error: getErrorMessage(error) });
      throw createError(`Failed to clear cache: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache size in bytes
   */
  getSize(): number {
    return this.stats.totalSize;
  }

  /**
   * Get number of entries
   */
  getEntryCount(): number {
    return this.stats.entryCount;
  }

  /**
   * Get all cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache entries (for debugging)
   */
  entries(): Array<[string, CacheEntry<T>]> {
    return Array.from(this.cache.entries());
  }

  /**
   * Warm up cache with multiple entries
   */
  async warmUp(entries: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
    try {
      for (const entry of entries) {
        this.set(entry.key, entry.value, entry.ttl);
      }
      
      logger.info('Cache warmed up', { entryCount: entries.length });
    } catch (error) {
      logger.error('Cache warm up error', { error: getErrorMessage(error) });
      throw createError(`Failed to warm up cache: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Persist cache to storage
   */
  async persist(): Promise<void> {
    if (!this.options.enablePersistence) {
      return;
    }

    try {
      const data = {
        entries: Array.from(this.cache.entries()),
        stats: this.stats,
        timestamp: Date.now(),
      };

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.options.persistenceKey, JSON.stringify(data));
      }
      
      logger.debug('Cache persisted', { entryCount: this.cache.size });
    } catch (error) {
      logger.error('Cache persist error', { error: getErrorMessage(error) });
    }
  }

  /**
   * Load cache from storage
   */
  private loadFromPersistence(): void {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      const data = localStorage.getItem(this.options.persistenceKey);
      if (!data) {
        return;
      }

      const parsed = JSON.parse(data);
      const now = Date.now();

      // Only load if data is not too old (24 hours)
      if (now - parsed.timestamp > 24 * 60 * 60 * 1000) {
        return;
      }

      // Restore entries
      for (const [key, entry] of parsed.entries) {
        if (!this.isExpired(entry, now)) {
          this.cache.set(key, entry);
          this.accessOrder.push(key);
        }
      }

      // Restore stats
      this.stats = parsed.stats;

      logger.info('Cache loaded from persistence', { entryCount: this.cache.size });
    } catch (error) {
      logger.error('Cache load from persistence error', { error: getErrorMessage(error) });
    }
  }

  private isExpired(entry: CacheEntry<T>, now: number = Date.now()): boolean {
    if (!entry.ttl) {
      return false;
    }
    return now - entry.timestamp > entry.ttl;
  }

  private updateAccess(key: string, entry: CacheEntry<T>): void {
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    
    // Move to end of access order (most recently used)
    this.removeFromAccessOrder(key);
    this.accessOrder.push(key);
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
  }

  private ensureSpace(requiredSize: number): void {
    while (
      (this.stats.totalSize + requiredSize > this.options.maxSize || 
       this.stats.entryCount >= this.options.maxEntries) &&
      this.cache.size > 0
    ) {
      this.evictLRU();
    }
  }

  private evictLRU(): void {
    if (this.accessOrder.length === 0) {
      return;
    }

    const lruKey = this.accessOrder[0];
    this.delete(lruKey);
    this.stats.evictions++;
    
    logger.debug('Cache evicted LRU entry', { key: lruKey });
  }

  private calculateSize(value: T): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 1024; // Default size if calculation fails
    }
  }

  private recordHit(): void {
    this.stats.hits++;
    this.stats.totalRequests++;
    this.updateRates();
  }

  private recordMiss(): void {
    this.stats.misses++;
    this.stats.totalRequests++;
    this.updateRates();
  }

  private updateRates(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
      this.stats.missRate = this.stats.misses / this.stats.totalRequests;
    }
  }

  private updateAverageAccessTime(accessTime: number): void {
    const totalAccessTime = this.stats.averageAccessTime * (this.stats.hits - 1) + accessTime;
    this.stats.averageAccessTime = totalAccessTime / this.stats.hits;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanupExpired();
      if (this.options.enablePersistence) {
        this.persist();
      }
    }, 60000); // Cleanup every minute
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry, now)) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      this.delete(key);
    }

    if (expiredKeys.length > 0) {
      logger.debug('Cache cleanup completed', { expiredCount: expiredKeys.length });
    }
  }
}

// Export singleton instances for different use cases
export const projectCache = new CacheService({
  maxSize: 10 * 1024 * 1024, // 10MB
  maxAge: 10 * 60 * 1000, // 10 minutes
  maxEntries: 100,
  enablePersistence: true,
  persistenceKey: 'project_cache',
});

export const sessionCache = new CacheService({
  maxSize: 5 * 1024 * 1024, // 5MB
  maxAge: 30 * 60 * 1000, // 30 minutes
  maxEntries: 50,
  enablePersistence: true,
  persistenceKey: 'session_cache',
});

export const fileCache = new CacheService({
  maxSize: 20 * 1024 * 1024, // 20MB
  maxAge: 5 * 60 * 1000, // 5 minutes
  maxEntries: 200,
  enablePersistence: false, // Files change frequently
});

export const apiCache = new CacheService({
  maxSize: 2 * 1024 * 1024, // 2MB
  maxAge: 2 * 60 * 1000, // 2 minutes
  maxEntries: 50,
  enablePersistence: false,
});
