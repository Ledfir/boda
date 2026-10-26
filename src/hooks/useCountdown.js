import { useEffect, useMemo, useState } from 'react';

function compute(targetTime) {
  const diff = targetTime - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isPast: false,
  };
}

/** Contador en tiempo real hasta la fecha configurada (con su zona horaria). */
export default function useCountdown(targetIso) {
  const targetTime = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
  const [timeLeft, setTimeLeft] = useState(() => compute(targetTime));

  useEffect(() => {
    setTimeLeft(compute(targetTime));
    const interval = setInterval(() => setTimeLeft(compute(targetTime)), 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return timeLeft;
}