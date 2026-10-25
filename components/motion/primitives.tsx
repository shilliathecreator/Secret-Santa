"use client";
import {
  m,
  useMotionValue,
  useSpring,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { useState, type ReactNode, type ComponentProps } from "react";
import { useScene } from "./scene";
export function AnimatedButton({
  children,
  kind = "primary",
  className = "",
  ...props
}: Omit<ComponentProps<typeof m.button>, "children"> & {
  children: ReactNode;
  kind?: "primary" | "outline";
}) {
  const { reduced, fine } = useScene();
  const x = useMotionValue(0),
    y = useMotionValue(0),
    sx = useSpring(x, { stiffness: 300, damping: 24 }),
    sy = useSpring(y, { stiffness: 300, damping: 24 });
  return (
    <m.button
      {...props}
      className={`${kind} animated-cta ${className}`}
      style={{ x: reduced ? 0 : sx, y: reduced ? 0 : sy }}
      whileHover={reduced ? undefined : { scale: 1.015 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onPointerMove={(e) => {
        if (!fine || reduced || props.disabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.065);
        y.set((e.clientY - r.top - r.height / 2) * 0.1 - 2);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {kind === "outline" && (
        <svg
          className="button-trace"
          aria-hidden="true"
          width="100%"
          height="100%"
        >
          <rect
            x="1"
            y="1"
            width="calc(100% - 2px)"
            height="calc(100% - 2px)"
            rx="6"
            pathLength="1"
          />
        </svg>
      )}
      {children}
    </m.button>
  );
}
export function HeroTitle() {
  // Start the compositor-only mask on the first CSS paint, without waiting for hydration.
  // Motion handles subsequent interactions; this keeps the heading out of the JS critical path.
  return (
    <h1 id="sayfa-basligi" tabIndex={-1} className="hero-title">
      <span className="title-mask first-line">
        <span className="title-enter">Küçük bir hediye.</span>
      </span>
      <span className="title-mask">
        <span className="title-enter">Kocaman bir&nbsp;</span>
      </span>
      <span className="title-mask">
        <span className="magic title-enter">
          mutluluk
          <svg viewBox="0 0 390 20" aria-hidden="true">
            <path d="M4 12Q180 0 383 10M18 18Q180 8 361 15" />
          </svg>
        </span>
      </span>
      <span className="red">.</span>
    </h1>
  );
}
export function AnimatedHeader({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 12));
  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      {children}
    </header>
  );
}
export function Ambient() {
  return (
    <div className="snow" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `-${i * 1.9}s`,
            animationDuration: `${18 + (i % 8)}s`,
          }}
        />
      ))}
    </div>
  );
}
export function SoftPanel({
  children,
  className = "",
  instantExit = false,
  ...props
}: Omit<ComponentProps<typeof m.div>, "children"> & {
  children: ReactNode;
  instantExit?: boolean;
}) {
  const { reduced } = useScene();
  return (
    <m.div
      {...props}
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        instantExit
          ? { opacity: 0, transition: { duration: 0 } }
          : { opacity: 0, y: reduced ? 0 : -8 }
      }
      transition={{ duration: reduced ? 0 : 0.25 }}
    >
      {children}
    </m.div>
  );
}
export function Toast({ show }: { show: boolean }) {
  const { reduced } = useScene();
  return (
    <div className="toast-slot" role="status" aria-live="polite">
      {show && (
        <m.div
          className="copy-toast"
          initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <m.path
              d="m5 12 4 4 10-10"
              stroke="currentColor"
              strokeWidth="2"
              initial={false}
              animate={reduced ? {} : { pathLength: [0, 1] }}
            />
          </svg>
          Bağlantı kopyalandı
        </m.div>
      )}
    </div>
  );
}
export function Participant({ children }: { children: ReactNode }) {
  const { reduced } = useScene();
  return (
    <m.div
      initial={reduced ? false : { opacity: 0, scale: 0.92, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      {children}
    </m.div>
  );
}
export function FooterStar() {
  return (
    <svg
      className="footer-star"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2c1 7 3 9 10 10-7 1-9 3-10 10C11 15 9 13 2 12c7-1 9-3 10-10Z"
        stroke="#b8975c"
        strokeWidth="1.5"
      />
    </svg>
  );
}
