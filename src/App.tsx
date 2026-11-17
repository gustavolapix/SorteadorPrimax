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

const pool: Person[] = names.map((name, index) => ({
  name,
  location: locations[index % locations.length],
  document: `XXXXXX${String(1047 + index * 317).slice(-4)}`,
}));

const ROUND_WINNER_COUNTS = [6, 6, 3];
const TOTAL_WINNERS = ROUND_WINNER_COUNTS.reduce((total, count) => total + count, 0);

const randomPerson = (excluded: Set<string> = new Set()) => {
  const available = pool.filter((person) => !excluded.has(person.name));
  return available[Math.floor(Math.random() * available.length)] ?? pool[0];
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
  const [view, setView] = useState<"intro" | "draw" | "final">("intro");
  const [round, setRound] = useState(1);
  const [roundWinners, setRoundWinners] = useState<Person[]>([]);
  const [allWinners, setAllWinners] = useState<Person[]>([]);
  const [rolling, setRolling] = useState<Person[]>(() =>
    Array.from({ length: ROUND_WINNER_COUNTS[0] }, () => randomPerson()),
  );
  const winnersThisRound = ROUND_WINNER_COUNTS[round - 1];

  const excludedNames = useMemo(
    () => new Set(allWinners.map((winner) => winner.name)),
    [allWinners],
  );

  useEffect(() => {
    if (view !== "draw" || roundWinners.length === winnersThisRound) return;
    const timer = window.setInterval(() => {
      setRolling((current) =>
        current.map((person, index) =>
          index < roundWinners.length ? person : randomPerson(excludedNames),
        ),
      );
    }, 85);
    return () => window.clearInterval(timer);
  }, [excludedNames, roundWinners.length, view, winnersThisRound]);

  const selectWinner = useCallback(() => {
    if (view !== "draw") return;

    if (roundWinners.length === winnersThisRound) {
      if (round === ROUND_WINNER_COUNTS.length) {
        setView("final");
      } else {
        const nextRoundWinnerCount = ROUND_WINNER_COUNTS[round];
        setRound((current) => current + 1);
        setRoundWinners([]);
        setRolling(Array.from({ length: nextRoundWinnerCount }, () => randomPerson(excludedNames)));
      }
      return;
    }

    const index = roundWinners.length;
    let winner = rolling[index];
    const alreadySelected = new Set([...excludedNames, ...roundWinners.map((item) => item.name)]);
    if (alreadySelected.has(winner.name)) winner = randomPerson(alreadySelected);

    setRolling((current) => current.map((person, slot) => (slot === index ? winner : person)));
    setRoundWinners((current) => [...current, winner]);
    setAllWinners((current) => [...current, winner]);
  }, [excludedNames, rolling, round, roundWinners, view, winnersThisRound]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
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
              <PersonCard person={winner} selected compact key={`${winner.name}-${index}`} />
            ))}
          </div>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <button
        type="button"
        className="draw-content"
        onClick={selectWinner}
        aria-label="Sortear el siguiente posible ganador"
      >
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
      </button>
    </PageFrame>
  );
}
