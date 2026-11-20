import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

type Person = {
  name: string;
  location: string;
  document: string;
};

type View = "intro" | "draw" | "final";

type SpinState = {
  slotIndex: number;
  winner: Person;
  sequence: Person[];
  step: number;
  stepMs: number;
};

type DrawState = {
  view: View;
  round: number;
  roundWinners: Person[];
  allWinners: Person[];
  rolling: Person[];
  spin: SpinState | null;
  roundCompletedAt: number | null;
  confettiTrigger: number;
};

// Base de pruebas local (en produccion se reemplazara por la carga desde backend)
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

const ROUND_WINNER_COUNTS = [3];
const TOTAL_WINNERS = ROUND_WINNER_COUNTS.reduce((total, count) => total + count, 0);
const ROUND_PAUSE_MS = 95;

// Velocidad previa mas pausada y desaceleracion exponencial estilo jackpot: t(k) = BASE_MS * GROWTH^k
const IDLE_ROLL_MS = 250;
const SPIN_STEPS = 10;
const SPIN_BASE_MS = 250;
const SPIN_EXP_GROWTH = 1.15;

const STATE_STORAGE_KEY = "primax_sorteo_state_v2";

function randomInt(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return Math.floor((buf[0] / 2 ** 32) * max);
}

function pickDistinct(source: Person[], excludedDocs: Set<string>, count: number): Person[] {
  const available = source.filter((person) => !excludedDocs.has(person.document));
  for (let i = available.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}

function buildJackpotSequence(winner: Person, excludedDocs: Set<string>): Person[] {
  const decoys = pool.filter(
    (person) => !excludedDocs.has(person.document) && person.document !== winner.document,
  );
  const sequence: Person[] = [];
  let prevDoc = "";

  for (let i = 0; i < SPIN_STEPS - 1; i++) {
    const candidates = decoys.filter((p) => p.document !== prevDoc);
    const source = candidates.length > 0 ? candidates : decoys;
    const picked = source[randomInt(source.length)] ?? winner;
    sequence.push(picked);
    prevDoc = picked.document;
  }

  sequence.push(winner);
  return sequence;
}

function exponentialStepDelay(step: number): number {
  return Math.round(SPIN_BASE_MS * Math.pow(SPIN_EXP_GROWTH, step));
}

function createFreshIntroState(): DrawState {
  return {
    view: "intro",
    round: 1,
    roundWinners: [],
    allWinners: [],
    rolling: pickDistinct(pool, new Set(), ROUND_WINNER_COUNTS[0]),
    spin: null,
    roundCompletedAt: null,
    confettiTrigger: 0,
  };
}

function buildInitialState(): DrawState {
  const fallback = createFreshIntroState();

  try {
    const raw = localStorage.getItem(STATE_STORAGE_KEY);
    if (!raw) return fallback;
    const saved = JSON.parse(raw) as Partial<DrawState>;
    const view: View =
      saved.view === "intro" || saved.view === "draw" || saved.view === "final"
        ? saved.view
        : "intro";
    const round =
      typeof saved.round === "number" &&
      Number.isInteger(saved.round) &&
      saved.round >= 1 &&
      saved.round <= ROUND_WINNER_COUNTS.length
        ? saved.round
        : 1;
    const target = ROUND_WINNER_COUNTS[round - 1];
    const isPerson = (p: unknown): p is Person =>
      Boolean(p) &&
      typeof p === "object" &&
      typeof (p as Person).name === "string" &&
      typeof (p as Person).location === "string" &&
      typeof (p as Person).document === "string";

    const roundWinners = Array.isArray(saved.roundWinners)
      ? saved.roundWinners.filter(isPerson).slice(0, target)
      : [];
    const allWinners = Array.isArray(saved.allWinners)
      ? saved.allWinners.filter(isPerson).slice(0, TOTAL_WINNERS)
      : [];

    const excluded = new Set(allWinners.map((w) => w.document));
    const fillers = pickDistinct(pool, excluded, Math.max(0, target - roundWinners.length));

    return {
      view,
      round,
      roundWinners,
      allWinners,
      rolling: [...roundWinners, ...fillers],
      spin: null,
      roundCompletedAt: null,
      confettiTrigger: 0,
    };
  } catch {
    return fallback;
  }
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  color: string;
  rotation: number;
  vRot: number;
  wobble: number;
  spawnDelayMs: number;
};

const CONFETTI_COLORS = ["#FF6900", "#1E22AA", "#FFE13D"];

function ConfettiBurst({
  trigger,
  durationMs = 2800,
}: {
  trigger: number;
  durationMs?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (trigger === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const scale = Math.max(0.75, Math.min(width, height) / 820);
    const count = durationMs > 3000 ? 210 : 140;
    const maxSpawnDelay = Math.max(0, durationMs - 2200);

    // Disparo diagonal desde las esquinas inferiores izquierda y derecha
    const particles: Particle[] = Array.from({ length: count }, (_, index) => {
      const fromLeft = index % 2 === 0;
      const spreadDeg = 26 + Math.random() * 34; // 26° a 60° sobre la horizontal
      const angle = (spreadDeg * Math.PI) / 180;
      const speed = (14 + Math.random() * 12) * scale;
      const dir = fromLeft ? 1 : -1;

      return {
        x: fromLeft ? Math.random() * 28 : width - Math.random() * 28,
        y: height - Math.random() * 18,
        vx: Math.cos(angle) * speed * dir,
        vy: -Math.sin(angle) * speed,
        w: 8 + Math.random() * 7,
        h: 4 + Math.random() * 5,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.22,
        wobble: Math.random() * Math.PI * 2,
        spawnDelayMs: maxSpawnDelay > 0 ? Math.random() * maxSpawnDelay : 0,
      };
    });

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        if (elapsed < p.spawnDelayMs) continue;

        p.wobble += 0.08;
        p.vx *= 0.988;
        p.vy = p.vy * 0.992 + 0.36;
        p.x += p.vx + Math.sin(p.wobble) * 0.9;
        p.y += p.vy;
        p.rotation += p.vRot;

        ctx.save();
        ctx.globalAlpha = progress > 0.78 ? Math.max(0, 1 - (progress - 0.78) / 0.22) : 1;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (progress < 1) {
        rafId = window.requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    rafId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [durationMs, trigger]);

  return <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />;
}

function FooterStrips() {
  return (
    <div className="footer-strips">
      <img
        className="footer-superintendencia"
        src="./assets/stripSuperintendencia.svg"
        alt="Vigilado Superintendencia Financiera de Colombia - Bancolombia S.A. Establecimiento Bancario"
      />
      <img
        className="footer-strip-logos"
        src="./assets/stripLogos.svg"
        alt="En alianza con Bancolombia, Autoriza Coljuegos, Organiza Primax Siempre Más"
      />
    </div>
  );
}

function PersonCard({
  person,
  selected = false,
  compact = false,
  rollingTickKey,
  rollingDurationMs,
}: {
  person: Person;
  selected?: boolean;
  compact?: boolean;
  rollingTickKey?: string;
  rollingDurationMs?: number;
}) {
  return (
    <article
      className={`person-card ${selected ? "person-card--selected" : "person-card--rolling"} ${
        compact ? "person-card--compact" : ""
      }`}
    >
      {selected && <span className="winner-chip">¡Felicidades!</span>}
      <div
        key={selected ? `winner-${person.document}` : rollingTickKey}
        className="person-slot-track"
        style={
          !selected && rollingDurationMs
            ? ({ "--tick-duration": `${rollingDurationMs}ms` } as React.CSSProperties)
            : undefined
        }
      >
        <p className="person-name">{person.name}</p>
        <div className="person-details">
          <span>
            <img src="./assets/5314f.svg" alt="" />
            {person.location}
          </span>
          <span>
            <img src="./assets/19edb.svg" alt="" />
            {person.document}
          </span>
        </div>
      </div>
    </article>
  );
}

function PageFrame({ view, children }: { view: View; children: React.ReactNode }) {
  return (
    <main className={`page-frame page-frame--${view}`}>
      <div className="vt-circle" aria-hidden="true" />
      <div className="vt-stage">
        <div className="backdrop" aria-hidden="true" />
        <img className="campaign-logo" src="./assets/2c143.png" alt="Gana con Primax" />
        {children}
        <footer>
          <FooterStrips />
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  const [state, setState] = useState<DrawState>(buildInitialState);
  const { view, round, roundWinners, allWinners, rolling, spin, confettiTrigger } = state;
  const winnersThisRound = ROUND_WINNER_COUNTS[round - 1];
  const isRoundComplete = roundWinners.length >= winnersThisRound;
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STATE_STORAGE_KEY,
        JSON.stringify({ view, round, roundWinners, allWinners }),
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [allWinners, round, roundWinners, view]);

  // Giro continuo fluido para las tarjetas pendientes mientras no estan desacelerando
  useEffect(() => {
    if (view !== "draw" || isRoundComplete) return;
    const timer = window.setInterval(() => {
      setState((prev) => {
        const target = ROUND_WINNER_COUNTS[prev.round - 1];
        if (prev.view !== "draw" || prev.roundWinners.length >= target) return prev;

        const lockedCount = prev.spin ? prev.spin.slotIndex + 1 : prev.roundWinners.length;
        const freeSlots = target - lockedCount;
        if (freeSlots <= 0) return prev;

        const excluded = new Set(prev.allWinners.map((w) => w.document));
        if (prev.spin) excluded.add(prev.spin.winner.document);
        const fillers = pickDistinct(pool, excluded, freeSlots);

        return {
          ...prev,
          rolling: [...prev.rolling.slice(0, lockedCount), ...fillers],
        };
      });
    }, IDLE_ROLL_MS);
    return () => window.clearInterval(timer);
  }, [isRoundComplete, view]);

  // Desaceleracion exponencial estilo jackpot: aterriza en el ganador y luego lo consagra
  useEffect(() => {
    if (!spin) return;

    const timer = window.setTimeout(() => {
      setState((prev) => {
        if (!prev.spin) return prev;
        const nextStep = prev.spin.step + 1;

        // Cuando termina la pausa del ultimo paso (que ya muestra al ganador), se marca como ganador
        if (nextStep >= prev.spin.sequence.length) {
          const winner = prev.spin.winner;
          const target = ROUND_WINNER_COUNTS[prev.round - 1];
          const nextRoundWinners = [...prev.roundWinners, winner];
          const nextAllWinners = [...prev.allWinners, winner];
          const completedNow = nextRoundWinners.length === target;

          return {
            ...prev,
            rolling: prev.rolling.map((person, slot) =>
              slot === prev.spin!.slotIndex ? winner : person,
            ),
            roundWinners: nextRoundWinners,
            allWinners: nextAllWinners,
            spin: null,
            roundCompletedAt: completedNow ? Date.now() : null,
            confettiTrigger: prev.confettiTrigger + 1,
          };
        }

        const nextPerson = prev.spin.sequence[nextStep];
        return {
          ...prev,
          rolling: prev.rolling.map((person, slot) =>
            slot === prev.spin!.slotIndex ? nextPerson : person,
          ),
          spin: {
            ...prev.spin,
            step: nextStep,
            stepMs: exponentialStepDelay(nextStep),
          },
        };
      });
    }, spin.stepMs);

    return () => window.clearTimeout(timer);
  }, [spin]);

  const startDrawWithTransition = useCallback(() => {
    if (isTransitioningRef.current) return;

    const nextDrawState: DrawState = {
      view: "draw",
      round: 1,
      roundWinners: [],
      allWinners: [],
      rolling: pickDistinct(pool, new Set(), ROUND_WINNER_COUNTS[0]),
      spin: null,
      roundCompletedAt: null,
      confettiTrigger: 0,
    };

    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { finished: Promise<void> };
    };

    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      isTransitioningRef.current = true;
      document.documentElement.classList.add("vt-intro-to-draw");
      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setState(nextDrawState);
        });
      });
      transition.finished.finally(() => {
        document.documentElement.classList.remove("vt-intro-to-draw");
        isTransitioningRef.current = false;
      });
    } else {
      setState(nextDrawState);
    }
  }, []);

  const advanceDraw = useCallback(() => {
    setState((prev) => {
      if (prev.view !== "draw" || prev.spin !== null) return prev;

      const target = ROUND_WINNER_COUNTS[prev.round - 1];
      if (prev.roundWinners.length >= target) {
        if (prev.roundCompletedAt && Date.now() - prev.roundCompletedAt < ROUND_PAUSE_MS) {
          return prev;
        }
        if (prev.round >= ROUND_WINNER_COUNTS.length) {
          return {
            ...prev,
            view: "final",
            roundCompletedAt: Date.now(),
            confettiTrigger: prev.confettiTrigger + 1,
          };
        }
        const nextRound = prev.round + 1;
        const nextCount = ROUND_WINNER_COUNTS[nextRound - 1];
        const excluded = new Set(prev.allWinners.map((w) => w.document));
        return {
          ...prev,
          round: nextRound,
          roundWinners: [],
          rolling: pickDistinct(pool, excluded, nextCount),
          spin: null,
          roundCompletedAt: null,
        };
      }

      const slotIndex = prev.roundWinners.length;
      const excluded = new Set(prev.allWinners.map((w) => w.document));
      const winner = pickDistinct(pool, excluded, 1)[0];
      if (!winner) return prev;

      const sequence = buildJackpotSequence(winner, excluded);
      const initialStepMs = exponentialStepDelay(0);

      return {
        ...prev,
        rolling: prev.rolling.map((person, slot) => (slot === slotIndex ? sequence[0] : person)),
        spin: {
          slotIndex,
          winner,
          sequence,
          step: 0,
          stepMs: initialStepMs,
        },
      };
    });
  }, []);

  const resetDraw = useCallback(() => {
    setState((prev) => {
      if (prev.view !== "final") return prev;
      if (prev.roundCompletedAt && Date.now() - prev.roundCompletedAt < ROUND_PAUSE_MS) {
        return prev;
      }
      try {
        localStorage.removeItem(STATE_STORAGE_KEY);
      } catch {
        // Ignore storage errors
      }
      return createFreshIntroState();
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      const isEnter =
        event.key === "Enter" || event.code === "Enter" || event.code === "NumpadEnter";
      const isSpace = event.code === "Space";

      if (view === "intro") {
        if (!isEnter && !isSpace) return;
        event.preventDefault();
        startDrawWithTransition();
        return;
      }

      if (view === "draw") {
        if (!isEnter && !isSpace) return;
        event.preventDefault();
        advanceDraw();
        return;
      }

      if (view === "final") {
        if (!isEnter && !isSpace) return;
        event.preventDefault();
        resetDraw();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [advanceDraw, resetDraw, startDrawWithTransition, view]);

  if (view === "intro") {
    return (
      <PageFrame view="intro">
        <section className="intro">
          <h1>
            ¡Bienvenidos a nuestro
            <br />
            segundo sorteo!
          </h1>
        </section>
      </PageFrame>
    );
  }

  if (view === "final") {
    return (
      <PageFrame view="final">
        <ConfettiBurst trigger={confettiTrigger} durationMs={4000} />
        <section className="final-content" aria-live="polite">
          <div className="final-heading">
            <h1>
              Felicitaciones a nuestros <strong>{TOTAL_WINNERS} posibles ganadores</strong> de
              <br />
              <strong>20 millones de pesos</strong> cada uno
            </h1>
            <p>en tarjeta bono regalo de Bancolombia...</p>
          </div>
          <div className="final-grid">
            {allWinners.map((winner, index) => (
              <PersonCard person={winner} selected compact key={`${winner.document}-${index}`} />
            ))}
          </div>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame view="draw">
      <ConfettiBurst trigger={confettiTrigger} durationMs={2800} />
      <section className="draw-content">
        <div className="draw-heading">
          {/* <span>
            Ronda {round} de {ROUND_WINNER_COUNTS.length}
          </span> */}
          <h1>Y los posibles ganadores son...</h1>
        </div>
        <div className="draw-grid" aria-live="polite">
          {rolling.map((person, index) => {
            const isSelected = index < roundWinners.length;
            const isSpinningSlot = spin?.slotIndex === index;
            const tickKey = isSpinningSlot
              ? `spin-${index}-${spin.step}-${person.document}`
              : `roll-${index}-${person.document}`;
            return (
              <PersonCard
                person={person}
                selected={isSelected}
                rollingTickKey={tickKey}
                rollingDurationMs={isSpinningSlot ? spin.stepMs : IDLE_ROLL_MS}
                key={isSelected ? person.document : `slot-${index}`}
              />
            );
          })}
        </div>
        <div
          className="round-progress"
          aria-label={`${roundWinners.length} de ${winnersThisRound} seleccionados`}
        >
          {Array.from({ length: winnersThisRound }, (_, index) => (
            <span className={index < roundWinners.length ? "complete" : ""} key={index} />
          ))}
        </div>
      </section>
    </PageFrame>
  );
}
