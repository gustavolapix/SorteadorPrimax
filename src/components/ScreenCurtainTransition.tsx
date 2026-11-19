import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface ScreenCurtainTransitionProps {
  isActive: boolean;
  onCovered: () => void;
  onComplete: () => void;
}

export function ScreenCurtainTransition({
  isActive,
  onCovered,
  onComplete,
}: ScreenCurtainTransitionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "covering" | "revealing">("idle");

  useEffect(() => {
    if (isActive && phase === "idle") setPhase("covering");
  }, [isActive, phase]);

  if (!isActive && phase === "idle") return null;

  if (shouldReduceMotion) {
    return (
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ background: "linear-gradient(135deg, #FFE13D, #FF6900)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onAnimationComplete={() => { onCovered(); onComplete(); setPhase("idle"); }}
          />
        )}
      </AnimatePresence>
    );
  }

  const gradient = "radial-gradient(circle at center, #FFE13D 0%, #FF6900 100%)";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {phase === "covering" && (
          <motion.div
            key="iris-in"
            className="absolute inset-0"
            style={{ background: gradient }}
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
              onCovered();
              setPhase("revealing");
            }}
          />
        )}
        {phase === "revealing" && (
          <motion.div
            key="iris-out"
            className="absolute inset-0"
            style={{ background: gradient }}
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            animate={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            onAnimationComplete={() => {
              setPhase("idle");
              onComplete();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
