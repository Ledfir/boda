import React, { useEffect, useState } from 'react';
import WelcomeGate from '@/components/intro/WelcomeGate';
import MusicToggle from '@/components/layout/MusicToggle';
import FloatingUtilities from '@/components/layout/FloatingUtilities';
import Hero from '@/components/sections/Hero';
import InvitationMessage from '@/components/sections/InvitationMessage';
import Countdown from '@/components/sections/Countdown';
import OurStory from '@/components/sections/OurStory';
import Gallery from '@/components/sections/Gallery';
import CeremonyReception from '@/components/sections/CeremonyReception';
import Itinerary from '@/components/sections/Itinerary';
import DressCode from '@/components/sections/DressCode';
import Gifts from '@/components/sections/Gifts';
import Rsvp from '@/components/sections/Rsvp';
import Dedications from '@/components/sections/Dedications';
import GuestAlbum from '@/components/sections/GuestAlbum';
import Closing from '@/components/sections/Closing';
import { weddingConfig } from '@/config/wedding';
import { playAmbient, setupAmbient } from '@/lib/ambientAudio';

/** Invitación digital completa: experiencia de una sola página. */
export default function Invitation() {
  const [opened, setOpened] = useState(false);
  const { music, couple, date } = weddingConfig;

  useEffect(() => {
    setupAmbient({ src: music.src, volume: music.initialVolume });
  }, [music.src, music.initialVolume]);

  useEffect(() => {
    document.title = `${couple.display} · Nuestra boda · ${date.displayShort}`;
  }, [couple.display, date.displayShort]);

  const handleOpen = () => {
    setOpened(true);
    if (music.src) playAmbient();
  };

  return (
    <div className="min-h-[100svh] bg-background">
      {!opened && <WelcomeGate onOpen={handleOpen} />}

      {opened && (
        <>
          <MusicToggle />
          <FloatingUtilities />
          <main>
            <Hero />
            <InvitationMessage />
            <Countdown />
            <OurStory />
            <Gallery />
            <CeremonyReception />
            <Itinerary />
            <DressCode />
            <Gifts />
            <Rsvp />
            <Dedications />
            <GuestAlbum />
            <Closing />
          </main>
        </>
      )}
    </div>
  );
}