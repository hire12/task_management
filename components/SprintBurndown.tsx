"use client";

import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface BurndownDataPoint {
  day: number;
  idealRemaining: number;
  actualRemaining: number;
}

interface SprintBurndownProps {
  totalTasks: number;
  completedTasks: number;
  sprintDays?: number;
  className?: string;
}

export const SprintBurndown: React.FC<SprintBurndownProps> = ({
  totalTasks,
  completedTasks,
  sprintDays = 14,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const margin = { top: 20, right: 25, bottom: 30, left: 35 };
    const width = 460 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Mock data points based on sprint progress
    const data: BurndownDataPoint[] = [];
    const currentDay = Math.min(sprintDays, Math.max(1, Math.round((completedTasks / (totalTasks || 1)) * sprintDays)));

    for (let d = 0; d <= sprintDays; d++) {
      const ideal = totalTasks - (totalTasks / sprintDays) * d;
      let actual = totalTasks;
      if (d <= currentDay) {
        // actual progression
        actual = totalTasks - (completedTasks / currentDay) * d + (Math.sin(d) * 0.5);
      }
      data.push({
        day: d,
        idealRemaining: Math.max(0, ideal),
        actualRemaining: d <= currentDay ? Math.max(0, actual) : (null as any),
      });
    }

    const xScale = d3.scaleLinear().domain([0, sprintDays]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, Math.max(5, totalTasks)]).range([height, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("opacity", 0.08)
      .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(() => ""));

    // Axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "text-[10px] text-content-placeholder")
      .call(d3.axisBottom(xScale).ticks(sprintDays / 2).tickFormat((d) => `D${d}`));

    g.append("g")
      .attr("class", "text-[10px] text-content-placeholder")
      .call(d3.axisLeft(yScale).ticks(5));

    // Ideal Line (dashed)
    const idealLine = d3
      .line<BurndownDataPoint>()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d.idealRemaining));

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#64748b")
      .attr("stroke-dasharray", "4,4")
      .attr("stroke-width", 1.5)
      .attr("d", idealLine);

    // Actual Line (solid accent)
    const actualData = data.filter((d) => d.actualRemaining !== null);
    const actualLine = d3
      .line<BurndownDataPoint>()
      .x((d) => xScale(d.day))
      .y((d) => yScale(d.actualRemaining))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(actualData)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2.5)
      .attr("d", actualLine);

    // Dots on actual
    g.selectAll(".dot")
      .data(actualData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.day))
      .attr("cy", (d) => yScale(d.actualRemaining))
      .attr("r", 3.5)
      .attr("fill", "#22c55e")
      .attr("stroke", "#15191d")
      .attr("stroke-width", 1.5);
  }, [totalTasks, completedTasks, sprintDays]);

  return (
    <div className="p-4 rounded-xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12.5px] font-semibold text-content-primary">
          Sprint Burndown & Velocity
        </span>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-content-placeholder">
            <span className="w-2.5 h-0.5 bg-slate-400 border-dashed" /> Ideal
          </span>
          <span className="flex items-center gap-1.5 text-brandSuccess font-medium">
            <span className="w-2.5 h-0.5 bg-brandSuccess" /> Actual
          </span>
        </div>
      </div>
      <svg ref={svgRef} viewBox="0 0 460 200" className="w-full h-auto overflow-visible" />
    </div>
  );
};
