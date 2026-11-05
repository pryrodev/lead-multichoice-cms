"use client";

import DottedMap from "dotted-map";
import { motion } from "motion/react";
import { useMemo } from "react";

type Point = { lat: number; lng: number; label: string };
const kigali: Point = { lat: -1.9441, lng: 30.0619, label: "Kigali" };
const origins: Point[] = [
  { lat: 51.5072, lng: -0.1276, label: "London" },
  { lat: 52.52, lng: 13.405, label: "Berlin" },
  { lat: 40.7128, lng: -74.006, label: "New York" },
  { lat: 25.2048, lng: 55.2708, label: "Dubai" },
  { lat: 19.076, lng: 72.8777, label: "Mumbai" },
  { lat: 31.2304, lng: 121.4737, label: "Shanghai" },
  { lat: -26.2041, lng: 28.0473, label: "Johannesburg" },
];

const W = 800,
  H = 400;
const project = (p: Point) => ({ x: (p.lng + 180) * (W / 360), y: (90 - p.lat) * (H / 180) });
const curve = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  `M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 50} ${b.x} ${b.y}`;

export function WorldMap({ className }: { className?: string }) {
  const svgMap = useMemo(() => {
    const map = new DottedMap({ height: 100, grid: "diagonal" });
    return map.getSVG({
      radius: 0.22,
      color: "#fbc02c",
      shape: "circle",
      backgroundColor: "transparent",
    });
  }, []);
  const end = project(kigali);

  return (
    <div className={`relative aspect-[2/1] w-full ${className ?? ""}`}>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        alt=""
        aria-hidden
        className="pointer-events-none h-full w-full select-none [mask-image:linear-gradient(to_bottom,transparent,white_12%,white_88%,transparent)]"
        draggable={false}
      />
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
        role="img"
        aria-label="World map showing trade routes from international hubs to Kigali"
      >
        <defs>
          <linearGradient id="route" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brass-light)" stopOpacity="0" />
            <stop offset="10%" stopColor="var(--brass-light)" stopOpacity="1" />
            <stop offset="90%" stopColor="var(--brass-light)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--brass-light)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {origins.map((o, i) => (
          <motion.path
            key={o.label}
            d={curve(project(o), end)}
            fill="none"
            stroke="url(#route)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 * i, ease: "easeOut" }}
          />
        ))}
        {[...origins, kigali].map((p) => {
          const { x, y } = project(p);
          const hq = p === kigali;
          return (
            <g key={p.label}>
              <circle cx={x} cy={y} r={hq ? 3.5 : 2} fill="var(--brass-light)" />
              <circle cx={x} cy={y} r={hq ? 3.5 : 2} fill="var(--brass-light)" opacity="0.5">
                <animate
                  attributeName="r"
                  from={hq ? 3.5 : 2}
                  to={hq ? 14 : 8}
                  dur="1.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
