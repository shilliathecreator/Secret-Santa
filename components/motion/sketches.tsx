"use client";
import { m } from "motion/react";
import { useScene } from "./scene";
export default function Sketch({
  kind,
  delay = 0,
}: {
  kind: "home" | "note" | "draw" | "envelope";
  delay?: number;
}) {
  const { reduced } = useScene();
  const draw = {
    initial: false as const,
    animate: reduced ? {} : { pathLength: [0, 1] },
    transition: { duration: 1.2, delay },
  };
  return (
    <svg
      className={`sketch sketch-${kind}`}
      viewBox="0 0 140 100"
      fill="none"
      aria-hidden="true"
      stroke="#536d4e"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "home" && (
        <>
          <m.path
            {...draw}
            d="m22 45 44-30 45 28M32 40l-1 47 69 1 1-48M56 87l1-29 20 1v28"
          />
          <path d="m50 32 17-11 18 12" stroke="#b8975c" />
          <m.g
            initial={false}
            animate={
              reduced ? {} : { opacity: [0, 1, 0.5, 1], scale: [0.85, 1.1, 1] }
            }
            transition={{ delay: delay + 1, duration: 0.8 }}
            style={{ transformOrigin: "112px 68px" }}
          >
            <path
              d="m104 64 7-7a8 8 0 0 1 11 11l-8 8m-2-2-7 7a8 8 0 0 1-11-11l8-8m2 9 8-8"
              stroke="#b8975c"
            />
          </m.g>
        </>
      )}
      {kind === "note" && (
        <>
          <path d="m33 14 70 4-4 73-71-3Z" fill="#f4eddc" stroke="#b8975c" />
          {[34, 47, 60, 73].map((y, i) => (
            <m.path
              key={y}
              {...draw}
              transition={{ delay: delay + i * 0.2, duration: 0.5 }}
              d={`m43 ${y} ${i === 3 ? 28 : 43} 2`}
            />
          ))}
          <m.g
            initial={false}
            animate={
              reduced ? {} : { x: [0, 8, 0], y: [0, 3, 0], rotate: [0, -8, 0] }
            }
            transition={{ delay: delay + 0.2, duration: 1.5 }}
            style={{ transformOrigin: "103px 52px" }}
          >
            <path
              d="m92 64 15-43 9 4-15 42-10 9Z"
              fill="#d0ab6c"
              stroke="#806526"
            />
          </m.g>
        </>
      )}
      {kind === "draw" && (
        <>
          {[-1, 1, 0].map((n, i) => (
            <m.g
              key={n}
              initial={false}
              animate={
                reduced
                  ? {}
                  : {
                      x: [n * 17, -n * 12, n * 17],
                      rotate: [n * 12, -n * 18, n * 9],
                      opacity: n === 0 ? 1 : [1, 0.6, 1],
                    }
              }
              transition={{ duration: 1.4, delay: delay + i * 0.12 }}
              style={{ transformOrigin: "70px 54px" }}
            >
              <rect
                x="47"
                y="20"
                width="47"
                height="66"
                rx="5"
                fill={n === 0 ? "#f7e4dc" : "#e9eddf"}
              />
              {n === 0 && (
                <m.g
                  initial={false}
                  animate={reduced ? {} : { scaleX: [1, 0, 1] }}
                  transition={{ duration: 0.7, delay: delay + 0.9 }}
                  style={{ transformOrigin: "70px 55px" }}
                >
                  <path
                    d="M57 48h27v8H57zm3 8v18h21V56M70 48v26m0-26c-19-2-9-16 0 0 18-2 9-16 0 0"
                    stroke="#ad473c"
                  />
                </m.g>
              )}
            </m.g>
          ))}
        </>
      )}
      {kind === "envelope" && (
        <>
          <path d="M21 38 70 13l50 25v47H21Z" fill="#e9eddf" />
          <path d="m22 40 48 31 49-31M21 85l36-29m62 29L84 56" />
          <m.path
            d="m21 38 49 32 50-32"
            stroke="#b8975c"
            fill="#f4eddc"
            initial={false}
            animate={reduced ? {} : { scaleY: [-1, 1], opacity: [0.3, 1] }}
            transition={{ duration: 0.8 }}
            style={{ transformOrigin: "70px 38px" }}
          />
          <m.g
            initial={false}
            animate={
              reduced
                ? {}
                : {
                    scale: [1.6, 0.92, 1],
                    rotate: [0, -6, 4, 0],
                    opacity: [0, 1],
                  }
            }
            transition={{ delay: delay + 0.65, duration: 0.55 }}
            style={{ transformOrigin: "70px 65px" }}
          >
            <circle cx="70" cy="65" r="12" fill="#ad473c" stroke="#ad473c" />
            <path d="m64 65 4 4 8-9" stroke="#f4eddc" />
          </m.g>
        </>
      )}
    </svg>
  );
}
