// utils/sound.ts
export const playCorrectSound = () => {
  const audio = new Audio("/sounds/chime1.mp3");
  audio.volume = 0.5;
  audio.play();
};

export const playIncorrectSound = () => {
  const audio = new Audio("/sounds/chime3.mp3");
  audio.volume = 0.5;
  audio.play();
};
