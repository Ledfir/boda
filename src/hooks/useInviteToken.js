import { useMemo } from 'react';
import { parseGuestLink } from '@/lib/guestLink';

/**
 * Lee el enlace personalizado del invitado (?invitado=... / ?token=...)
 * para prellenar su nombre y conocer el cupo máximo autorizado.
 */
export default function useInviteToken() {
  return useMemo(() => parseGuestLink(), []);
}