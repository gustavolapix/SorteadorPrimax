import confetti from "canvas-confetti";

export function fireWinnerConfetti() {
  // Primax & campaign colors: Orange, Gold, Yellow, Red, White, Blue
  const primaxColors = ["#FF6900", "#FFD700", "#FF4500", "#FFA500", "#FFFFFF", "#1435CC"];

  // Disparo central expansivo
  confetti({
    particleCount: 75,
    spread: 80,
    origin: { y: 0.65 },
    colors: primaxColors,
    startVelocity: 45,
    scalar: 1.2,
  });

  // Ráfagas laterales estilo evento
  setTimeout(() => {
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.7 },
      colors: primaxColors,
      startVelocity: 55,
    });
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.7 },
      colors: primaxColors,
      startVelocity: 55,
    });
  }, 180);
}

export function fireGrandFinaleConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const primaxColors = ["#FF6900", "#FFD700", "#FF4500", "#FFA500", "#FFFFFF", "#1435CC"];

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }
    const particleCount = 40 * (timeLeft / duration);
    confetti({
      particleCount,
      spread: 90,
      origin: { x: Math.random() * 0.8 + 0.1, y: Math.random() * 0.4 + 0.2 },
      colors: primaxColors,
      startVelocity: 35,
    });
  }, 200);
}
