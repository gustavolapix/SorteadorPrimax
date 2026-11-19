import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Person } from "../types/jackpot";

interface JackpotSlotCardProps {
  person: Person;
  status: "idle" | "spinning" | "stopping" | "won";
  currentInterval?: number;
  compact?: boolean;
}

export function JackpotSlotCard({
  person,
  status,
  currentInterval = 50,
  compact = false,
}: JackpotSlotCardProps) {
  const isWon = status === "won";
  const isStopping = status === "stopping";
  const isSpinning = status === "spinning";
  const isActive = isSpinning || isStopping;

  // Desenfoque de movimiento vertical dinámico según velocidad
  const isFast = isActive && currentInterval < 120;
  const motionBlur = isFast ? "blur(0px 2px)" : "blur(0px)";

  if (compact) {
    // Tarjeta compacta para la pantalla final
    return (
      <motion.article
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="person-card person-card--compact person-card--selected relative overflow-hidden"
      >
        <p className="person-name text-amber-200 font-bold">{person.name}</p>
        <div className="person-details text-white/90">
          <span>
            <img src="/assets/5314f.svg" alt="" className="w-3.5 h-3.5" />
            {person.location}
          </span>
          <span>
            <img src="/assets/19edb.svg" alt="" className="w-3.5 h-3.5" />
            {person.document}
          </span>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      animate={
        isWon
          ? {
              scale: [1, 1.08, 1.02],
              borderColor: ["#FFFFFF", "#FFE13D", "#FFE13D"],
            }
          : isActive
            ? {
                scale: 1.01,
                borderColor: "#FF9900",
              }
            : {
                scale: 1,
                borderColor: "rgba(255, 255, 255, 0.7)",
              }
      }
      transition={{
        scale: isWon ? { type: "spring", stiffness: 280, damping: 14 } : { duration: 0.2 },
        borderColor: { duration: 0.4 },
      }}
      className={`relative flex flex-col items-center justify-center min-w-0 h-[122px] px-6 py-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        isWon
          ? "bg-gradient-to-br from-orange-600/60 via-amber-600/40 to-red-700/60 shadow-[0_0_22px_rgba(255,225,61,0.35),inset_0_0_14px_rgba(255,225,61,0.15)]"
          : isActive
            ? "bg-orange-500/20 shadow-[0_0_20px_rgba(255,105,0,0.4)]"
            : "bg-white/10 hover:bg-white/15"
      }`}
    >
      {/* Resplandor decorativo de fondo cuando es ganador */}
      {isWon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0.25, 0.5, 0.25], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 bg-gradient-to-r from-[#FF6900]/15 via-[#FFE13D]/20 to-[#FF6900]/15 rounded-2xl blur-xl pointer-events-none"
        />
      )}

      {/* Badge de "¡GANADOR!" que aparece con animación */}
      <AnimatePresence>
        {isWon && (
          <motion.div
            initial={{ y: -25, opacity: 0, scale: 0.4 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="absolute top-2 right-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-neutral-900 font-extrabold text-[11px] tracking-wider uppercase shadow-md shadow-orange-950/40 z-20"
          >
            <img src="/assets/badge-icon.png" alt="" className="w-3.5 h-3.5 object-contain" />
            <span>Felicitaciones</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tira vertical / Contenedor de ruleta jackpot */}
      <div className="relative w-full overflow-hidden text-center flex flex-col items-center justify-center h-full">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={person.name}
            initial={{
              y: isActive ? -28 : 0,
              opacity: isActive ? 0.3 : 1,
              filter: motionBlur,
            }}
            animate={{
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              scale: isWon ? [1, 1.16, 1] : 1,
            }}
            exit={{
              y: isActive ? 28 : 0,
              opacity: 0,
              filter: motionBlur,
            }}
            transition={{
              y: {
                duration: isActive
                  ? Math.max(0.04, Math.min((currentInterval / 1000) * 0.75, 0.22))
                  : 0.25,
                ease: "easeOut",
              },
              scale: {
                duration: 0.5,
                times: [0, 0.45, 1],
                ease: "easeOut",
              },
              opacity: {
                duration: isActive
                  ? Math.max(0.03, Math.min((currentInterval / 1000) * 0.7, 0.15))
                  : 0.2,
              },
            }}
            className="w-full flex flex-col items-center justify-center"
          >
            {/* Nombre del participante */}
            <motion.p
              className={`w-full m-0 mb-1.5 font-bold tracking-tight text-center truncate px-2 select-none ${
                isWon
                  ? "text-[#FFE13D] drop-shadow-[0_0_8px_rgba(255,225,61,0.5)]"
                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              }`}
              style={{
                fontFamily: "'Clash Grotesk:Bold', sans-serif",
                fontSize: "clamp(22px, 2.3vw, 28px)",
                lineHeight: "1.2",
              }}
            >
              {person.name}
            </motion.p>

            {/* Detalles: Ubicación y Cédula */}
            <div
              className={`flex items-center justify-center gap-3.5 text-[15px] font-medium transition-colors select-none ${
                isWon ? "text-amber-100 font-semibold" : "text-white/80"
              }`}
              style={{ fontFamily: "'Clash Grotesk:Medium', sans-serif" }}
            >
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <img
                  src="/assets/5314f.svg"
                  alt=""
                  className={`w-4 h-4 transition-transform ${isWon ? "scale-110" : ""}`}
                />
                {person.location}
              </span>
              <span className="opacity-40">|</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <img
                  src="/assets/19edb.svg"
                  alt=""
                  className={`w-4 h-4 transition-transform ${isWon ? "scale-110" : ""}`}
                />
                {person.document}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
