"use client";

import { motion } from "framer-motion";
import { useId } from "react";

export default function AnimatedGridPattern() {
  const id = useId();

  return (
    <div className="absolute inset-0 z-0">
      <svg width="100%" height="100%" className="bg-primary/80">
        <defs>
          <pattern
            id={id}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternContentUnits="userSpaceOnUse"
            x="0"
            y="0"
          >
            <motion.path
              d="M.5 20V.5h20"
              fill="none"
              stroke="hsla(var(--primary-foreground), 0.1)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
