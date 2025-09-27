"use client";

import React, { useMemo, useId } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";

export interface D3SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fillOpacity?: number;
  showEndDot?: boolean;
  strokeWidth?: number;
  className?: string;
}

export const D3Sparkline: React.FC<D3SparklineProps> = ({
  data = [2, 4, 3, 7, 5, 8, 6, 9, 11, 10, 14],
  width = 96,
  height = 28,
  color = "var(--color-accent)",
  fillOpacity = 0.12,
  showEndDot = true,
  strokeWidth = 1.5,
  className,
}) => {
  const gradientId = useId();

  const { linePath, areaPath, lastPoint } = useMemo(() => {
    if (!data || data.length === 0) {
      return { linePath: "", areaPath: "", lastPoint: null };
    }

    const padding = 2;
    const effectiveWidth = width - padding * 2;
    const effectiveHeight = height - padding * 2;

    const minVal = Math.min(...data);
    const maxVal = Math.max(...data);
    const yDomainMin = minVal === maxVal ? minVal - 1 : minVal;
    const yDomainMax = minVal === maxVal ? maxVal + 1 : maxVal;

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([yDomainMin, yDomainMax])
      .range([height - padding, padding]);

    const lineGenerator = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    const areaGenerator = d3
      .area<number>()
      .x((_, i) => xScale(i))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    const lPath = lineGenerator(data) || "";
    const aPath = areaGenerator(data) || "";

    const lastX = xScale(data.length - 1);
    const lastY = yScale(data[data.length - 1]);

    return {
      linePath: lPath,
      areaPath: aPath,
      lastPoint: { x: lastX, y: lastY },
    };
  }, [data, width, height]);

  if (!linePath) return null;

  return (
    <div className={cn("inline-flex items-center select-none", className)}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity * 2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Gradient Area Fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />

        {/* Trendline */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing End Dot */}
        {showEndDot && lastPoint && (
          <g transform={`translate(${lastPoint.x}, ${lastPoint.y})`}>
            <circle r={2.5} fill={color} />
          </g>
        )}
      </svg>
    </div>
  );
};
