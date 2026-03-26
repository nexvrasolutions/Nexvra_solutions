"use client";

import { motion } from "framer-motion";

const pushDir = [
  { x: -7, y: -7 },
  { x:  7, y: -7 },
  { x:  7, y:  7 },
  { x: -7, y:  7 },
];

const items = [
  {
    id: 0, num: "01", lines: ["Innovative", "Approach"],
    numX: 170, numY: 40, numAnchor: "end", textX: 90, textY: [168, 185],
    d: "M 177 0 L 177 197 L 7 197 L 7 120 Q 7 100 27 88 L 177 0 Z",
  },
  {
    id: 1, num: "02", lines: ["Trusted", "Expertise"],
    numX: 190, numY: 40, numAnchor: "start", textX: 190, textY: [170, 187],
    d: "M 183 0 L 331 87 Q 353 100 353 125 L 353 197 L 183 197 L 183 0 Z",
  },
  {
    id: 2, num: "03", lines: ["Future-Ready", "Solutions"],
    numX: 190, numY: 370, numAnchor: "start", textX: 190, textY: [223, 240],
    d: "M 183 203 L 353 203 L 353 275 Q 353 300 331 312 L 183 400 L 183 203 Z",
  },
  {
    id: 3, num: "04", lines: ["Impact-", "Driven"],
    numX: 170, numY: 370, numAnchor: "end", textX: 110, textY: [223, 240],
    d: "M 177 203 L 177 400 L 29 312 Q 7 300 7 275 L 7 203 L 177 203 Z",
  },
];

interface HexQuadProps {
  active: number;
  setActive: (id: number) => void;
}

export default function HexQuad({ active, setActive }: HexQuadProps) {
  return (
    <svg 
    // width={600} height={600} 
    viewBox="-10 -10 380 420"
    className="w-full sm:w-[300px] md:w-[350px] lg:w-[450px] xl:w-[500px] 
    h-auto"
    >
      {items.map((item) => {
        const isActive = active === item.id;
        const fg = isActive ? "#1a1a1a" : "#BFBFBF";
        const dir = pushDir[item.id];

        return (
          <motion.g
            key={item.id}
            onClick={() => setActive(item.id)}
            style={{ cursor: "pointer" }}
            animate={{
              x: isActive ? dir.x : 0,
              y: isActive ? dir.y : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <motion.path
              d={item.d}
              animate={{ fill: isActive ? "#A4FF00" : "#E8E8E8" }}
              transition={{ duration: 0.4 }}
            />
            <text
              x={item.numX} y={item.numY}
              textAnchor={item.numAnchor as any}
              fontSize={13} fontWeight={600} fill={fg}
            >
              {item.num}
            </text>
            {item.lines.map((line, i) => (
              <text
                className="font-primary font-medium text-sm leading-7"
                key={i}
                x={item.textX} y={item.textY[i]}
                textAnchor="start"
                fontSize={15} fontWeight={700} fill={fg}
              >
                {line}
              </text>
            ))}
          </motion.g>
        );
      })}
    </svg>
  );
}