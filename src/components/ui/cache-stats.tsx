'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  RefreshCw, 
  Trash2, 
  Database, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { CacheService, CacheStats } from '@/services/cache.service';
import { cn } from '@/lib/utils';

interface CacheStatsProps {
  cacheService: CacheService;
  title?: string;
  className?: string;
  showActions?: boolean;
  refreshInterval?: number;
}

export function CacheStatsComponent({
  cacheService,
  title = 'Cache Statistics',
  className,
  showActions = true,
  refreshInterval = 5000,
}: CacheStatsProps) {
  const [stats, setStats] = useState<CacheStats>(cacheService.getStats());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheService.getStats());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [cacheService, refreshInterval]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      setStats(cacheService.getStats());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClear = () => {
    cacheService.clear();
    setStats(cacheService.getStats());
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getHitRateColor = (rate: number): string => {
    if (rate >= 0.8) return 'text-green-600';
    if (rate >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHitRateBadgeVariant = (rate: number): 'default' | 'secondary' | 'destructive' => {
    if (rate >= 0.8) return 'default';
    if (rate >= 0.6) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          {title}
        </CardTitle>
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Hit/Miss Rate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hit Rate</span>
              <Badge variant={getHitRateBadgeVariant(stats.hitRate)}>
                {formatPercentage(stats.hitRate)}
              </Badge>
            </div>
            <Progress 
              value={stats.hitRate * 100} 
              className="h-2"
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              {formatNumber(stats.hits)} hits
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Miss Rate</span>
              <Badge variant="secondary">
                {formatPercentage(stats.missRate)}
              </Badge>
            </div>
            <Progress 
              value={stats.missRate * 100} 
              className="h-2"
            />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3" />
              {formatNumber(stats.misses)} misses
            </div>
          </div>
        </div>

        {/* Cache Size and Entries */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cache Size</span>
            </div>
            <p className="text-2xl font-bold">{formatBytes(stats.totalSize)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.entryCount)} entries
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Requests</span>
            </div>
            <p className="text-2xl font-bold">{formatNumber(stats.totalRequests)}</p>
            <p className="text-xs text-muted-foreground">
              {formatNumber(stats.evictions)} evictions
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Average Access Time</span>
          </div>
          <p className="text-lg font-semibold">
            {stats.averageAccessTime.toFixed(2)}ms
          </p>
        </div>

        {/* Cache Health Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Cache Health</span>
            <div className="flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                stats.hitRate >= 0.8 ? 'bg-green-500' :
                stats.hitRate >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              )} />
              <span className={cn(
                'text-xs font-medium',
                getHitRateColor(stats.hitRate)
              )}>
                {stats.hitRate >= 0.8 ? 'Excellent' :
                 stats.hitRate >= 0.6 ? 'Good' : 'Poor'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface CacheStatsGridProps {
  caches: Array<{
    name: string;
    service: CacheService;
    title?: string;
  }>;
  className?: string;
}

export function CacheStatsGrid({ caches, className }: CacheStatsGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {caches.map(({ name, service, title }) => (
        <CacheStatsComponent
          key={name}
          cacheService={service}
          title={title || `${name} Cache`}
          showActions={true}
        />
      ))}
    </div>
  );
}

// Hook for using cache statistics
export function useCacheStats(cacheService: CacheService, refreshInterval: number = 5000) {
  const [stats, setStats] = useState<CacheStats>(cacheService.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(cacheService.getStats());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [cacheService, refreshInterval]);

  const refresh = () => {
    setStats(cacheService.getStats());
  };

  const clear = () => {
    cacheService.clear();
    setStats(cacheService.getStats());
  };

  return {
    stats,
    refresh,
    clear,
    isHealthy: stats.hitRate >= 0.6,
    isExcellent: stats.hitRate >= 0.8,
  };
}
