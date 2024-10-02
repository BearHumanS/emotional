export const formatTime = (s: number) => {
  const min = Math.floor(s / 60);
  const seconds = s % 60;

  return `${min}:${seconds < 10 ? '0' : ''}${seconds}`;
};
