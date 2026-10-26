import { useEffect, useState } from 'react';
import { getAmbientState, subscribeAmbient } from '@/lib/ambientAudio';

export default function useAmbientMusic() {
  const [state, setState] = useState(getAmbientState);

  useEffect(() => subscribeAmbient(setState), []);

  return state;
}