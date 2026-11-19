import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ScreenCurtainTransition } from "./components/ScreenCurtainTransition";
import { JackpotSlotCard } from "./components/JackpotSlotCard";
import { Person, DecelerationProfile, calculateInterval } from "./types/jackpot";
import { fireWinnerConfetti, fireGrandFinaleConfetti } from "./utils/confetti";

const names = [
  "María Tarazona Contreras López",
  "Carmen Carvajal",
  "Carlos Querales",
  "Valentina Rojas",
  "Santiago Restrepo",
  "Laura Hernández",
  "Andrés Martínez",
  "Juliana Pineda",
  "Mateo González",
  "Camila Rodríguez",
  "Felipe Castaño",
  "Daniela Nogueira",
  "Alejandro Vargas",
  "Paula Jiménez",
  "Sebastián Ospina",
  "Natalia Ramírez",
  "Juan Pablo Torres",
  "Isabella Moreno",
  "Nicolás Salazar",
  "Sofía Valencia",
  "David Quintero",
  "Mariana Gómez",
  "Samuel Bedoya",
  "Gabriela Castro",
  "Tomás Arango",
  "Luciana Mejía",
  "Emilio Sánchez",
  "Sara Cardona",
  "Martín Vélez",
  "Antonia Acosta",
];

const locations = [
  "Medellín, Antioquia",
  "Sabaneta, Antioquia",
  "Bogotá, Cundinamarca",
  "Cali, Valle del Cauca",
  "Cartagena, Bolívar",
  "Barranquilla, Atlántico",
  "Pereira, Risaralda",
  "Manizales, Caldas",
  "Bucaramanga, Santander",
  "Santa Marta, Magdalena",
];

const pool: Person[] = names.map((name, index) => ({
  name,
  location: locations[index % locations.length],
  document: `XXXXXX${String(1047 + index * 317).slice(-4)}`,
}));

const ROUND_WINNER_COUNTS = [3, 3, 3];
const TOTAL_WINNERS = ROUND_WINNER_COUNTS.reduce((total, count) => total + count, 0);

// Criptográficamente seguro para sorteos oficiales auditables
const cryptoIndex = (len: number) => {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % len;
};

const getRandomPerson = (excludedNames: Set<string> = new Set()) => {
  const available = pool.filter((person) => !excludedNames.has(person.name));
  return available.length > 0 ? available[cryptoIndex(available.length)] : pool[0];
};

function FooterStrips() {
  return (
    <div className="footer-strips">
      <img
        className="footer-superintendencia"
        src="/assets/stripSuperintendencia.svg"
        alt="Vigilado Superintendencia Financiera de Colombia - Bancolombia S.A. Establecimiento Bancario"
      />
      <img
        className="footer-strip-logos"
        src="/assets/stripLogos.svg"
        alt="En alianza con Bancolombia, Autoriza Coljuegos, Organiza Primax Siempre Más"
      />
    </div>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-frame">
      <div className="backdrop" aria-hidden="true" />
      <div className="backdrop-overlay" aria-hidden="true" />
      <img className="campaign-logo" src="/assets/2c143.png" alt="Gana con Primax" />
      {children}
      <footer>
        <FooterStrips />
      </footer>
    </main>
  );
}

export default function App() {
  const [view, setView] = useState<"intro" | "draw" | "final">("intro");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [round, setRound] = useState(1);
  const [roundWinners, setRoundWinners] = useState<Person[]>([]);
  const [allWinners, setAllWinners] = useState<Person[]>([]);
  const [activeProfile, setActiveProfile] = useState<DecelerationProfile>("exponential");

  const winnersThisRound = ROUND_WINNER_COUNTS[round - 1];

  // Nombres visibles en los slots de la ronda actual
  const [slotPersons, setSlotPersons] = useState<Person[]>(() =>
    Array.from({ length: ROUND_WINNER_COUNTS[0] }, (_, i) => pool[i % pool.length]),
  );

  // Estados del giro Jackpot
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningSlotIndex, setSpinningSlotIndex] = useState<number | null>(null);
  const [currentInterval, setCurrentInterval] = useState(40);

  const timeoutRef = useRef<number | null>(null);

  // Excluir ganadores anteriores
  const takenNames = useMemo(() => new Set(allWinners.map((winner) => winner.name)), [allWinners]);

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Transición desde Pantalla #1 con el Boomerang de Primax
  const handleStartDraw = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
  }, [isTransitioning]);

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false);
    setView("draw");
  }, []);


  // Lógica de Sorteo Jackpot con desaceleración configurable
  const handleDrawWinner = useCallback(() => {
    if (view !== "draw" || isSpinning) return;

    // Si ya completamos todos los ganadores de la ronda, avanzar a siguiente ronda o final
    if (roundWinners.length === winnersThisRound) {
      if (round === ROUND_WINNER_COUNTS.length) {
        setView("final");
        fireGrandFinaleConfetti();
      } else {
        const nextRoundCount = ROUND_WINNER_COUNTS[round];
        setRound((curr) => curr + 1);
        setRoundWinners([]);
        const available = pool.filter((p) => !takenNames.has(p.name));
        const shuffled = [...available].sort(() => cryptoIndex(3) - 1);
        setSlotPersons(shuffled.slice(0, nextRoundCount));
      }
      return;
    }

    const slotIndex = roundWinners.length;
    // Seleccionar ganador único con aleatoriedad criptográfica
    const alreadyChosen = new Set([...takenNames, ...roundWinners.map((w) => w.name)]);
    const availablePool = pool.filter((p) => !alreadyChosen.has(p.name));
    const finalWinner =
      availablePool.length > 0 ? availablePool[cryptoIndex(availablePool.length)] : pool[0];

    setIsSpinning(true);
    setSpinningSlotIndex(slotIndex);

    const totalDuration = 5000; // 5 s — desaceleración visible y dramática
    const startTime = Date.now();

    const runJackpotStep = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / totalDuration);

      if (progress >= 1) {
        // Asentar al ganador final
        setSlotPersons((prev) =>
          prev.map((person, idx) => (idx === slotIndex ? finalWinner : person)),
        );
        setRoundWinners((prev) => [...prev, finalWinner]);
        setAllWinners((prev) => [...prev, finalWinner]);
        setIsSpinning(false);
        setSpinningSlotIndex(null);
        setCurrentInterval(40);
        fireWinnerConfetti();
        return;
      }

      // Calcular intervalo según la curva de desaceleración seleccionada
      const nextInterval = calculateInterval(progress, activeProfile, 55, 820);
      setCurrentInterval(nextInterval);

      // Elegir nombre aleatorio temporal durante el giro
      const tempPerson =
        availablePool.length > 0 ? availablePool[cryptoIndex(availablePool.length)] : pool[0];
      setSlotPersons((prev) =>
        prev.map((person, idx) => (idx === slotIndex ? tempPerson : person)),
      );

      timeoutRef.current = window.setTimeout(runJackpotStep, nextInterval);
    };

    runJackpotStep();
  }, [activeProfile, isSpinning, round, roundWinners, takenNames, view, winnersThisRound]);

  // Manejo de teclado (Enter & Barra espaciadora)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Enter o Barra Espaciadora para avanzar / sortear
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        if (view === "intro") {
          handleStartDraw();
        } else if (view === "draw") {
          handleDrawWinner();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleDrawWinner, handleStartDraw, view]);

  // ==========================================
  // PANTALLA #1: INTRO (Limpia, sin logo superior ni botón, activación por Enter / Espacio)
  // ==========================================
  if (view === "intro") {
    return (
      <PageFrame>
        <ScreenCurtainTransition
          isActive={isTransitioning}
          onCovered={() => {}}
          onComplete={handleTransitionComplete}
        />
        <section
          className="intro flex flex-col items-center justify-center cursor-pointer select-none"
          onClick={handleStartDraw}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <h1>
              ¡Bienvenidos a nuestro
              <br />
              primer sorteo!
            </h1>
          </motion.div>
        </section>
      </PageFrame>
    );
  }

  // ==========================================
  // PANTALLA #3: FINAL (15 Ganadores)
  // ==========================================
  if (view === "final") {
    return (
      <PageFrame>
        <section className="final-content" aria-live="polite">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="final-heading"
          >
            <h1>
              Felicitaciones a nuestros <strong>{TOTAL_WINNERS} posibles ganadores</strong> de
              <br />
              <strong>20 millones de pesos</strong> cada uno
            </h1>
            <p>en tarjeta bono regalo de Bancolombia...</p>
          </motion.div>

          <div className="final-grid">
            {allWinners.map((winner, index) => (
              <JackpotSlotCard
                person={winner}
                status="won"
                compact
                key={`${winner.name}-${index}`}
              />
            ))}
          </div>
        </section>
      </PageFrame>
    );
  }

  // ==========================================
  // PANTALLA #2: SORTEO CON JACKPOT Y TARJETAS AMPLIADAS
  // ==========================================
  const isRoundComplete = roundWinners.length === winnersThisRound;

  // Variantes iris reutilizables para elementos individuales
  const irisVariants = {
    hidden: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
    visible: { clipPath: "circle(150% at 50% 50%)", opacity: 1 },
  };

  return (
    <PageFrame>
      <section
        className="draw-content cursor-pointer select-none"
        aria-label="Pantalla de sorteo jackpot"
        onClick={handleDrawWinner}
      >
        <div className="draw-heading">
          {/* Iris del badge de ronda */}
          <motion.span
            key={`round-badge-${round}`}
            variants={irisVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          >
            Ronda {round} de {ROUND_WINNER_COUNTS.length}
          </motion.span>

          {/* Iris del título */}
          <motion.h1
            key={`round-title-${round}`}
            variants={irisVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          >
            Y los posibles ganadores son...
          </motion.h1>
        </div>

        {/* Grilla con divs ampliados y adaptados */}
        <div
          className={`draw-grid ${winnersThisRound % 2 !== 0 ? "draw-grid--center-last" : ""}`}
          aria-live="polite"
          aria-busy={isSpinning}
        >
          {slotPersons.map((person, index) => {
            const hasWon = index < roundWinners.length;
            const isCurrentlySpinning = isSpinning && spinningSlotIndex === index;

            let status: "idle" | "spinning" | "stopping" | "won" = "idle";
            if (hasWon) {
              status = "won";
            } else if (isCurrentlySpinning) {
              status = "stopping";
            }

            return (
              // Iris escalonado por tarjeta — delay crece con el índice
              <motion.div
                key={`card-wrap-${round}-${index}`}
                style={{ overflow: "hidden", borderRadius: "1rem" }}
                variants={irisVariants}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.5,
                  ease: [0.23, 1, 0.32, 1],
                  delay: 0.28 + index * 0.08,
                }}
              >
                <JackpotSlotCard
                  person={person}
                  status={status}
                  currentInterval={currentInterval}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Progreso de la ronda y orden */}
        <motion.div
          key={`progress-${round}`}
          variants={irisVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: 0.55 }}
          className="round-progress"
          aria-label={`${roundWinners.length} de ${winnersThisRound} seleccionados`}
        >
          {Array.from({ length: winnersThisRound }, (_, index) => (
            <span key={index} className={index < roundWinners.length ? "complete" : ""} />
          ))}
        </motion.div>
      </section>
    </PageFrame>
  );
}
