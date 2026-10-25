"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { LazyMotion, MotionConfig } from "motion/react";
const loadFeatures = () =>
  import("./features").then((module) => module.default);
const SceneContext = createContext({
  reduced: true,
  visible: true,
  fine: false,
  mobile: true,
});
export const useScene = () => useContext(SceneContext);
export function MotionScene({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true),
    [fine, setFine] = useState(false),
    [mobile, setMobile] = useState(true);
  // Default to no motion until the OS preference is known; CSS covers pre-hydration.
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const pointer = matchMedia("(hover: hover) and (pointer: fine)"),
      size = matchMedia("(max-width: 720px)"),
      motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setFine(pointer.matches);
      setMobile(size.matches);
      setReduced(motionPreference.matches);
    };
    const visibility = () => {
      setVisible(!document.hidden);
      document.documentElement.dataset.pageHidden = String(document.hidden);
    };
    update();
    visibility();
    pointer.addEventListener("change", update);
    size.addEventListener("change", update);
    motionPreference.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      pointer.removeEventListener("change", update);
      size.removeEventListener("change", update);
      motionPreference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);
  return (
    <SceneContext.Provider value={{ reduced, visible, fine, mobile }}>
      <MotionConfig
        reducedMotion={reduced ? "always" : "never"}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <LazyMotion features={loadFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </SceneContext.Provider>
  );
}
