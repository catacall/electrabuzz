import confetti from "canvas-confetti";

export const fireConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 60,
    shapes: ["circle", "square"],
    scalar: 2,
    ticks: 200,
    origin: { y: 0.7 },
  });
};
