import progressStream from 'progress-stream';

export const dispProgress = (ps: progressStream.Progress) => {
  const DIVIDER = 1024 * 1024;
  const transferred = (ps.transferred / DIVIDER).toFixed(1);
  const length = (ps.length / DIVIDER).toFixed(1);
  const speed = (ps.speed / DIVIDER).toFixed(1);
  const s = `[${transferred} / ${length} Mb] speed: ${speed}/Mb, remaining: ${ps.eta}s, total: ${ps.runtime}s`;
  return s;
};
