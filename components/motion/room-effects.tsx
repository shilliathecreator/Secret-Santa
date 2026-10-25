"use client";
import { m } from "motion/react";
import type { ReactNode } from "react";
import { useScene } from "./scene";
export function Shuffle() {
  const { reduced, visible } = useScene();
  return (
    <div
      className="shuffle-visual"
      role="status"
      aria-label="Kura karıştırılıyor"
    >
      <svg viewBox="0 0 160 120" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <m.g
            key={i}
            initial={false}
            animate={
              reduced || !visible ? {} : { rotate: [i * 120, i * 120 + 360] }
            }
            style={{ transformOrigin: "80px 60px" }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          >
            <rect
              x="68"
              y="12"
              width="30"
              height="42"
              rx="4"
              fill={["#e9eddf", "#f7e4dc", "#f4eddc"][i]}
              stroke="#b8975c"
            />
            <path d="M76 26h14m-14 7h14" stroke="#536d4e" strokeWidth="2" />
          </m.g>
        ))}
      </svg>
    </div>
  );
}
export function Reveal({ children }: { children: ReactNode }) {
  const { reduced } = useScene();
  return (
    <div className="reveal-stage">
      <m.div
        className="reveal"
        role="status"
        initial={reduced ? false : { rotateY: 85, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
      {!reduced && (
        <svg
          className="result-confetti"
          viewBox="0 0 360 260"
          aria-hidden="true"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <m.path
              key={i}
              d={
                i % 2
                  ? "M0 5C-15-3-6-12 0-5C6-12 15-3 0 5Z"
                  : "M0-7 2-2 7 0 2 2 0 7-2 2-7 0-2-2Z"
              }
              fill={["#b8975c", "#ad473c", "#7d8867"][i % 3]}
              initial={{ x: 180, y: 180, opacity: 0, scale: 0.4 }}
              animate={{
                x: 25 + i * 34,
                y: 25 + Math.abs(i - 4.5) * 16,
                opacity: [0, 1, 0],
                rotate: i * 32,
                scale: 1,
              }}
              transition={{ duration: 1, delay: i * 0.025 }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
