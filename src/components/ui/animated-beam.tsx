'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathD, setPathD] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updatePath = () => {
      if (!svgRef.current || !fromRef.current || !toRef.current || !containerRef.current) {
        return;
      }

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      const svgWidth = Math.max(fromRect.width, toRect.width, Math.abs(endX - startX));
      const svgHeight = Math.max(fromRect.height, toRect.height, Math.abs(endY - startY));

      const svgElement = svgRef.current;
      svgElement.style.width = `${svgWidth}px`;
      svgElement.style.height = `${svgHeight}px`;
      svgElement.style.left = `${Math.min(startX, endX)}px`;
      svgElement.style.top = `${Math.min(startY, endY)}px`;

      const normalizedStartX = startX - Math.min(startX, endX);
      const normalizedStartY = startY - Math.min(startY, endY);
      const normalizedEndX = endX - Math.min(startX, endX);
      const normalizedEndY = endY - Math.min(startY, endY);

      const controlPointX = (normalizedStartX + normalizedEndX) / 2;
      const controlPointY =
        Math.min(normalizedStartY, normalizedEndY) -
        Math.abs(normalizedEndX - normalizedStartX) * curvature;

      const pathData = `M ${normalizedStartX} ${normalizedStartY} Q ${controlPointX} ${controlPointY} ${normalizedEndX} ${normalizedEndY}`;
      setPathD(pathData);
      setSvgDimensions({ width: svgWidth, height: svgHeight });
    };

    updatePath();

    const resizeObserver = new ResizeObserver(updatePath);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className={cn('pointer-events-none absolute', reverse ? 'scale-x-[-1]' : '', className)}
      style={{
        position: 'absolute',
        zIndex: 10,
      }}
    >
      <defs>
        <linearGradient
          id="gradient"
          gradientUnits="userSpaceOnUse"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="0%"
        >
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientStopColor} />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={pathD}
        stroke="url(#gradient)"
        strokeWidth={pathWidth}
        strokeOpacity={0.8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4 2"
        className="animate-pulse"
        style={{
          animation: `dash ${duration}s linear ${delay}s infinite`,
        }}
      />
    </svg>
  );
}

interface AnimatedBeamsProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement>;
  fromRef: React.RefObject<HTMLElement>;
  toRefs: React.RefObject<HTMLElement>[];
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeams({
  className,
  containerRef,
  fromRef,
  toRefs,
  curvature = 0,
  reverse = false,
  duration = Math.random() * 3 + 4,
  delay = 0,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#ffaa40',
  gradientStopColor = '#9c40ff',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamsProps) {
  return (
    <div className={cn('relative', className)}>
      {toRefs.map((toRef, index) => (
        <AnimatedBeam
          key={index}
          containerRef={containerRef}
          fromRef={fromRef}
          toRef={toRef}
          curvature={curvature}
          reverse={reverse}
          duration={duration}
          delay={delay + index * 0.1}
          pathColor={pathColor}
          pathWidth={pathWidth}
          pathOpacity={pathOpacity}
          gradientStartColor={gradientStartColor}
          gradientStopColor={gradientStopColor}
          startXOffset={startXOffset}
          startYOffset={startYOffset}
          endXOffset={endXOffset}
          endYOffset={endYOffset}
        />
      ))}
    </div>
  );
}
