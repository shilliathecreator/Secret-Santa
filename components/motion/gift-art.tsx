"use client";
import { m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScene } from "./scene";
const body = "M115 201 Q208 198 303 203 L300 349 Q205 355 116 347 Z";
const lid = "M106 177 Q206 172 311 179 L310 206 Q209 202 106 206 Z";
export function GiftArt() {
  const { reduced, fine } = useScene();
  const [open, setOpen] = useState(false),
    [burst, setBurst] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrate = () => {
    if (reduced) return;
    setOpen(true);
    setBurst((n) => n + 1);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 1100);
  };
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  return (
    <button
      className="hero-art drawn-gift"
      aria-label="Hediye kutusu illüstrasyonunu canlandır"
      onPointerEnter={() => {
        if (fine) celebrate();
      }}
      onClick={celebrate}
    >
      <svg
        viewBox="0 0 440 440"
        fill="none"
        aria-hidden="true"
        className="gift-illustration"
      >
        <ellipse
          cx="220"
          cy="382"
          rx="154"
          ry="22"
          fill="#e1e4d7"
          opacity=".6"
        />
        <circle cx="222" cy="226" r="170" fill="#e9edde" opacity=".5" />
        <path
          d="M45 228C11 100 211 10 350 91C461 154 427 349 316 389"
          stroke="#b8beab"
          strokeDasharray="3 8"
        />
        <circle cx="327" cy="103" r="38" fill="#e9e4c8" />
        <path d="m353 142-52 112h23l-43 74h131l-40-75h22Z" fill="#405c3f" />
        <path d="m75 232-32 67h15l-29 54h95l-28-53h13Z" fill="#7d8867" />
        <g className="gift-colour">
          <path d={body} fill="#b54e40" />
          <path d="M194 202 221 201 222 351 193 350Z" fill="#dfc39b" />
          <path d="m120 211 4 128" stroke="#bd5145" strokeWidth="3" />
        </g>
        <path
          d={body}
          className="draw-outline"
          pathLength="1"
          stroke="#8f493d"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <m.g
          animate={{
            y: reduced ? 0 : open ? -17 : 0,
            rotate: reduced ? 0 : open ? -5 : 0,
          }}
          style={{ transformOrigin: "210px 190px" }}
          transition={{ type: "spring", stiffness: 200, damping: 17 }}
        >
          <path
            d={lid}
            className="draw-outline"
            pathLength="1"
            fill="#bd5145"
            fillOpacity=".94"
            stroke="#8f493d"
            strokeWidth="2.5"
          />
          <path d="m194 177 29-1v29l-30-1Z" fill="#dfc39b" />
          <g className="gift-ribbon" style={{ transformOrigin: "207px 178px" }}>
            <path
              d="M207 177C157 173 144 128 170 125C190 122 202 159 207 177C212 154 226 120 245 127C273 137 247 176 207 177Z"
              fill="#dfc39b"
              fillOpacity=".35"
              stroke="#b8975c"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="m207 177-18 43m18-43 20 38"
              stroke="#dfc39b"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </g>
        </m.g>
        <path
          d="m284 308 40-13 31 70-48 12Z"
          fill="#d0ab6c"
          stroke="#ad9157"
          strokeWidth="2"
        />
        <path d="m298 303 31 70" stroke="#f0e5c9" strokeWidth="10" />
        {[
          { x: 89, y: 121, s: 13 },
          { x: 354, y: 228, s: 9 },
          { x: 144, y: 65, s: 8 },
        ].map(({ x, y, s }, i) => (
          <path
            key={i}
            className="gift-twinkle"
            d={`M${x} ${y - s}Q${x + 2} ${y - 2} ${x + s} ${y}Q${x + 2} ${y + 2} ${x} ${y + s}Q${x - 2} ${y + 2} ${x - s} ${y}Q${x - 2} ${y - 2} ${x} ${y - s}Z`}
            fill="#b8975c"
            style={{
              transformOrigin: `${x}px ${y}px`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
        {!reduced && burst > 0 && (
          <m.g key={burst}>
            {Array.from({ length: 8 }, (_, i) => (
              <m.path
                key={i}
                d={
                  i % 2
                    ? "M0 5C-15-3-6-12 0-5C6-12 15-3 0 5Z"
                    : "M0-8 2-2 8 0 2 2 0 8-2 2-8 0-2-2Z"
                }
                fill={["#b8975c", "#bd5145", "#7d8867"][i % 3]}
                initial={{ x: 208, y: 175, opacity: 0, scale: 0.4 }}
                animate={{
                  x: 208 + (i - 3.5) * 24,
                  y: 65 + Math.abs(i - 3.5) * 17,
                  opacity: [0, 1, 0],
                  rotate: (i - 4) * 30,
                  scale: 1,
                }}
                transition={{ duration: 0.9, delay: i * 0.025 }}
              />
            ))}
          </m.g>
        )}
      </svg>
    </button>
  );
}
