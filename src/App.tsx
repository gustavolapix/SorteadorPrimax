import { useRef } from 'react';
import { useCallback, useEffect, useMemo, useState } from "react";

type Person = {
  name: string;
  location: string;
  document: string;
};

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

const defaultPool: Person[] = names.map((name, index) => ({
  name,
  location: locations[index % locations.length],
  document: `XXXXXX${String(1047 + index * 317).slice(-4)}`,
}));

const storedPool = localStorage.getItem("customPool");
const pool: Person[] = storedPool ? JSON.parse(storedPool) : defaultPool;

const ROUND_WINNER_COUNTS = [6, 6, 3];
const TOTAL_WINNERS = ROUND_WINNER_COUNTS.reduce((total, count) => total + count, 0);

const randomPerson = (excludedDocuments: Set<string> = new Set()) => {
  const available = pool.filter((person) => !excludedDocuments.has(person.document));
  return available[Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2**32) * available.length)] ?? pool[0];
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

function PersonCard({
  person,
  selected = false,
  compact = false,
}: {
  person: Person;
  selected?: boolean;
  compact?: boolean;
}) {
  return (
    <article
      className={`person-card ${selected ? "person-card--selected" : ""} ${
        compact ? "person-card--compact" : ""
      }`}
    >
      <p className="person-name">{person.name}</p>
      <div className="person-details">
        <span>
          <img src="/assets/5314f.svg" alt="" />
          {person.location}
        </span>
        <span>
          <img src="/assets/19edb.svg" alt="" />
          {person.document}
        </span>
      </div>
    </article>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="page-frame">
      <div className="backdrop" aria-hidden="true" />
      <img className="campaign-logo" src="/assets/2c143.png" alt="Gana con Primax" />
      {children}
      <footer>
        <FooterStrips />
      </footer>
    </main>
  );
}

export default function App() {
const [view, setView] = useState<"intro" | "draw" | "final">(() => (localStorage.getItem("view") as "intro" | "draw" | "final") || "intro");
const [round, setRound] = useState(() => parseInt(localStorage.getItem("round") || "1", 10));
const [roundWinners, setRoundWinners] = useState<Person[]>(() => JSON.parse(localStorage.getItem("roundWinners") || "[]"));
const [allWinners, setAllWinners] = useState<Person[]>(() => JSON.parse(localStorage.getItem("allWinners") || "[]"));

useEffect(() => {
  localStorage.setItem("view", view);
  localStorage.setItem("round", round.toString());
  localStorage.setItem("roundWinners", JSON.stringify(roundWinners));
  localStorage.setItem("allWinners", JSON.stringify(allWinners));
}, [view, round, roundWinners, allWinners]);

const resetDraw = () => {
  if (!window.confirm("¿Seguro que deseas reiniciar el sorteo? Se perderán todos los ganadores actuales.")) return;
  localStorage.clear();
  setView("intro");
  setRound(1);
  setRoundWinners([]);
  setAllWinners([]);
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as Person[];
      if (Array.isArray(data) && data.length >= TOTAL_WINNERS) {
        localStorage.setItem("customPool", JSON.stringify(data));
        window.location.reload();
      } else {
        alert(`El archivo debe ser un JSON con al menos ${TOTAL_WINNERS} participantes válidos.`);
      }
    } catch {
      alert("Error al procesar el archivo JSON.");
    }
  };
  reader.readAsText(file);
};
  const winnersThisRound = ROUND_WINNER_COUNTS[round - 1];

  const excludedDocuments = useMemo(
    () => new Set(allWinners.map((winner) => winner.document)),
    [allWinners],
  );

useEffect(() => {
    if (view !== "draw" || roundWinners.length === winnersThisRound) return;
    const timer = window.setInterval(() => {
      setRolling((current) => {
        const available = pool.filter((p) => !excludedDocuments.has(p.document));
        // Fisher-Yates manual (inline) para el tick visual
        for (let i = available.length - 1; i > 0; i--) {
          const j = Math.floor((crypto.getRandomValues(new Uint32Array(1))[0] / 2**32) * (i + 1));
          [available[i], available[j]] = [available[j], available[i]];
        }
        
        let availIndex = 0;
        return current.map((person, index) => {
          if (index < roundWinners.length) return person;
          const nextPerson = available[availIndex] ?? pool[0];
          availIndex++;
          return nextPerson;
        });
      });
    }, 85);
    return () => window.clearInterval(timer);
  }, [excludedDocuments, roundWinners.length, view, winnersThisRound]);

const actionLock = useRef(false);

  const selectWinner = useCallback(() => {
    if (view !== "draw" || actionLock.current) return;

    if (roundWinners.length === winnersThisRound) {
      actionLock.current = true;
      if (round === ROUND_WINNER_COUNTS.length) {
        setView("final");
        actionLock.current = false;
      } else {
        const nextRoundWinnerCount = ROUND_WINNER_COUNTS[round];
        setRound((current) => current + 1);
        setRoundWinners([]);
        setRolling(Array.from({ length: nextRoundWinnerCount }, () => randomPerson(excludedDocuments)));
        setTimeout(() => { actionLock.current = false; }, 700); // Bloqueo de 700ms entre rondas
      }
      return;
    }

    actionLock.current = true;
    const index = roundWinners.length;
    let winner = rolling[index];
    const alreadySelected = new Set([...excludedDocuments, ...roundWinners.map((item) => item.document)]);
    if (alreadySelected.has(winner.document)) winner = randomPerson(alreadySelected);

    setRolling((current) => current.map((person, slot) => (slot === index ? winner : person)));
    setRoundWinners((current) => [...current, winner]);
    setAllWinners((current) => [...current, winner]);
    setTimeout(() => { actionLock.current = false; }, 50);
  }, [excludedDocuments, rolling, round, roundWinners, view, winnersThisRound]);

useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat) return;
      event.preventDefault();
      if (view === "intro") setView("draw");
      else selectWinner();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectWinner, view]);

  if (view === "intro") {
    return (
      <PageFrame>
        <section className="intro">
          <h1>
            ¡Bienvenidos a nuestro
            <br />
            primer sorteo!
          </h1>
          <button type="button" onClick={() => setView("draw")}>
            Iniciar sorteo
          </button>
          <label style={{ display: 'block', marginTop: '24px', fontSize: '14px', cursor: 'pointer', opacity: 0.7 }}>
            Cargar participantes reales (JSON)
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileUpload} />
          </label>
        </section>
      </PageFrame>
    );
  }

  if (view === "final") {
    return (
      <PageFrame>
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
          <button type="button" onClick={resetDraw} style={{ marginTop: '40px', padding: '10px 20px', background: 'transparent', border: '1px solid white', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            Reiniciar Sorteo
          </button>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <section className="draw-content">
        <div className="draw-heading">
          <span>
            Ronda {round} de {ROUND_WINNER_COUNTS.length}
          </span>
          <h1>Y los posibles ganadores son...</h1>
        </div>
        <div
          className={`draw-grid ${winnersThisRound % 2 !== 0 ? "draw-grid--center-last" : ""}`}
          aria-live="polite"
        >
          {rolling.map((person, index) => (
            <PersonCard person={person} selected={index < roundWinners.length} key={index} />
          ))}
        </div>
        <div
          className="round-progress"
          aria-label={`${roundWinners.length} de ${winnersThisRound} seleccionados`}
        >
          {Array.from({ length: winnersThisRound }, (_, index) => (
            <span className={index < roundWinners.length ? "complete" : ""} key={index} />
          ))}
        </div>
      <button 
          type="button" 
          onClick={selectWinner}
          style={{ marginTop: '20px', padding: '10px 24px', background: '#ff6900', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Rethink Sans:Medium", sans-serif', fontSize: '16px' }}
        >
          {roundWinners.length === winnersThisRound ? 'Siguiente' : 'Sortear ganador'}
        </button>
      </section>
    </PageFrame>
  );
}
