/**
 * Cache Service Tests
 */

import { CacheService, CacheEntry } from '@/services/cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService({
      maxSize: 1024 * 1024, // 1MB
      maxAge: 1000, // 1 second
      maxEntries: 10,
      enableStats: true,
      enablePersistence: false,
    });
  });

  afterEach(() => {
    cache.clear();
  });

  describe('Basic Operations', () => {
    it('should set and get values', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      cache.set(key, value);
      const result = cache.get(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should delete entries', () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      cache.set(key, value);
      expect(cache.has(key)).toBe(true);

      const deleted = cache.delete(key);
      expect(deleted).toBe(true);
      expect(cache.has(key)).toBe(false);
    });

    it('should clear all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.getEntryCount()).toBe(2);

      cache.clear();
      expect(cache.getEntryCount()).toBe(0);
      expect(cache.getSize()).toBe(0);
    });
  });

  describe('TTL and Expiration', () => {
    it('should expire entries after TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      cache.set(key, value, 100); // 100ms TTL
      expect(cache.get(key)).toEqual(value);

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 150));
      expect(cache.get(key)).toBeNull();
    });

    it('should not expire entries without TTL', async () => {
      const key = 'test-key';
      const value = { data: 'test-value' };

      cache.set(key, value, 0); // No TTL (0 means no expiration)
      expect(cache.get(key)).toEqual(value);

      // Wait longer than default TTL
      await new Promise(resolve => setTimeout(resolve, 1500));
      expect(cache.get(key)).toEqual(value);
    });
  });

  describe('LRU Eviction', () => {
    it('should evict least recently used entries when max entries reached', () => {
      // Fill cache to max entries
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      expect(cache.getEntryCount()).toBe(10);

      // Add one more entry
      cache.set('key10', 'value10');
      expect(cache.getEntryCount()).toBe(10);

      // First entry should be evicted
      expect(cache.get('key0')).toBeNull();
      expect(cache.get('key10')).toBe('value10');
    });

    it('should update access order on get', () => {
      // Fill cache
      for (let i = 0; i < 10; i++) {
        cache.set(`key${i}`, `value${i}`);
      }

      // Access first entry
      cache.get('key0');

      // Add new entry
      cache.set('key10', 'value10');

      // key1 should be evicted (not key0)
      expect(cache.get('key0')).toBe('value0');
      expect(cache.get('key1')).toBeNull();
    });
  });

  describe('Statistics', () => {
    it('should track hit and miss statistics', () => {
      const stats = cache.getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.totalRequests).toBe(0);

      // Miss
      cache.get('non-existent');
      expect(cache.getStats().misses).toBe(1);
      expect(cache.getStats().totalRequests).toBe(1);

      // Hit
      cache.set('test', 'value');
      cache.get('test');
      expect(cache.getStats().hits).toBe(1);
      expect(cache.getStats().totalRequests).toBe(2);
    });

    it('should calculate hit rate correctly', () => {
      cache.set('test', 'value');

      // 1 hit, 1 miss
      cache.get('test'); // hit
      cache.get('non-existent'); // miss

      const stats = cache.getStats();
      expect(stats.hitRate).toBe(0.5);
      expect(stats.missRate).toBe(0.5);
    });

    it('should track cache size', () => {
      expect(cache.getSize()).toBe(0);

      cache.set('test', 'value');
      expect(cache.getSize()).toBeGreaterThan(0);
    });
  });

  describe('Warm Up', () => {
    it('should warm up cache with multiple entries', async () => {
      const entries = [
        { key: 'key1', value: 'value1' },
        { key: 'key2', value: 'value2' },
        { key: 'key3', value: 'value3' },
      ];

      await cache.warmUp(entries);

      expect(cache.getEntryCount()).toBe(3);
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      expect(cache.get('key3')).toBe('value3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty keys', () => {
      expect(() => cache.set('', 'value')).not.toThrow();
      expect(cache.get('')).toBe('value');
    });

    it('should handle null and undefined values', () => {
      cache.set('null', null);
      cache.set('undefined', undefined);

      expect(cache.get('null')).toBeNull();
      expect(cache.get('undefined')).toBeUndefined();
    });

    it('should handle large values', () => {
      const largeValue = 'x'.repeat(10000);
      cache.set('large', largeValue);

      expect(cache.get('large')).toBe(largeValue);
    });
  });
});
