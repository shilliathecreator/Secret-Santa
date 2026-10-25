"use client";
import dynamic from "next/dynamic";
import { m, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { useScene } from "./scene";
const Sketch = dynamic(() => import("./sketches"), { ssr: false });
export function LazySketch({
  kind,
  delay = 0,
}: {
  kind: "home" | "note" | "draw" | "envelope";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div
      ref={ref}
      className={`sketch-slot ${kind === "envelope" ? "envelope-slot" : ""}`}
      aria-hidden="true"
    >
      {inView && <Sketch kind={kind} delay={delay} />}
    </div>
  );
}
const steps = [
  {
    kind: "home" as const,
    title: "Kendi küçük dünyanı kur",
    first: "Arkadaşlarına özel bir oda oluştur.",
    second: "Davet bağlantınla herkesi bir araya getir.",
  },
  {
    kind: "note" as const,
    title: "Biraz kendinden bahset",
    first: "Takma adını seç, hediye notunu bırak.",
    second: "Küçük ipuçları, büyük gülümsemeler.",
  },
  {
    kind: "draw" as const,
    title: "Sırrını keşfet, mutlu et",
    first: "Kura çekilsin, hediye arkadaşın belli olsun.",
    second: "Kimin kime çıktığı sadece ona özel.",
  },
];
export function AnimatedSteps() {
  const ref = useRef<HTMLElement>(null);
  const { reduced, mobile } = useScene();
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 60%"],
  });
  const length = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <section ref={ref} id="nasil" className="how animated-steps">
      <div className="section-heading">
        <div>
          <span className="eyebrow">MUTLULUĞA GİDEN KISA YOL</span>
          <h2>
            Üç adımda yılbaşı sihri<span className="red">.</span>
          </h2>
        </div>
      </div>
      <div className="step-path" aria-hidden="true">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path
            d="M20 65C180 0 200 90 360 50S650 0 710 40 870 90 980 30"
            fill="none"
            stroke="#d8decd"
            strokeWidth="2"
            strokeDasharray="3 8"
          />
          <defs>
            <mask
              id="step-progress"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1000"
              height="100"
            >
              <m.path
                d="M20 65C180 0 200 90 360 50S650 0 710 40 870 90 980 30"
                fill="none"
                stroke="white"
                strokeWidth="6"
                style={{ pathLength: reduced ? 1 : length }}
              />
            </mask>
          </defs>
          <path
            d="M20 65C180 0 200 90 360 50S650 0 710 40 870 90 980 30"
            fill="none"
            stroke="#b8975c"
            strokeWidth="2"
            strokeDasharray="3 8"
            mask="url(#step-progress)"
          />
        </svg>
      </div>
      <div className="steps">
        {steps.map((step, i) => (
          <m.article
            key={step.kind}
            initial={false}
            animate={
              reduced
                ? {}
                : inView
                  ? { opacity: 1, y: 0, rotate: 0 }
                  : {
                      opacity: 1,
                      y: mobile ? 8 : 15,
                      rotate: mobile ? 0 : i % 2 ? 1 : -1,
                    }
            }
            transition={{ duration: 0.5, delay: mobile ? 0 : i * 0.16 }}
          >
            <LazySketch kind={step.kind} delay={mobile ? 0 : i * 1.5} />
            <span aria-hidden="true" className="step-number">
              0{i + 1}
            </span>
            <h3>{step.title}</h3>
            <p>
              {step.first}
              <br />
              {step.second}
            </p>
          </m.article>
        ))}
      </div>
    </section>
  );
}
