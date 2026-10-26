import React from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Reveal from '@/components/common/Reveal';
import { googleMapsDirectionsUrl, googleMapsUrl, wazeUrl } from '@/lib/maps';

/** Tarjeta de ceremonia o recepción con ubicación y enlaces a mapas. */
export default function VenueCard({ venue, kicker, delay = 0 }) {
  return (
    <Reveal delay={delay} className="flex h-full flex-col border border-border/80 bg-card">
      <div className="relative overflow-hidden">
        <Image
          src={venue.image}
          alt={venue.venue}
          loading="lazy"
          className="h-52 w-full object-cover sm:h-60"
          fittingType="fill"
        />
        <span className="absolute left-4 top-4 border border-primary/50 bg-background/90 px-3 py-1 text-[0.6rem] uppercase tracking-luxe text-foreground">
          {kicker}
        </span>
      </div>

      <div className="flex flex-1 flex-col bg-card p-6 sm:p-7">
        <h3 className="font-heading text-2xl text-foreground">{venue.venue}</h3>
        <span className="mt-3 h-px w-12 bg-primary/70" aria-hidden="true" />

        <dl className="mt-5 space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="sr-only">Fecha y hora</dt>
              <dd>
                {venue.date}
                <br />
                {venue.time}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <dt className="sr-only">Dirección</dt>
              <dd>{venue.address}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
          <a
            href={googleMapsDirectionsUrl(venue.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-primary bg-primary px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-primary-foreground transition hover:bg-transparent hover:text-foreground"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            {venue.buttonLabel}
          </a>
          <a
            href={googleMapsUrl(venue.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-primary/50 px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            Ver en Google Maps
          </a>
          <a
            href={wazeUrl(venue.address)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-primary/50 px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            Waze
          </a>
        </div>
      </div>
    </Reveal>
  );
}