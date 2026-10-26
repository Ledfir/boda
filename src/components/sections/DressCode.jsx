import React from 'react';
import { Shirt } from 'lucide-react';
import { Image } from '@/components/ui/image';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import { weddingConfig } from '@/config/wedding';

/** Código de vestimenta con referencias visuales discretas. */
export default function DressCode() {
  const { dressCode, texts } = weddingConfig;

  return (
    <SectionShell id="dress-code" tone="white">
      <SectionHeading
        kicker="Dress code"
        title={texts.dressCodeTitle}
        subtitle={texts.dressCodeSubtitle}
      />

      <Reveal delay={0.15} className="mt-12 border border-border/80 bg-background p-7 sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50">
            <Shirt className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <p className="mt-5 font-heading text-2xl text-foreground sm:text-3xl">{dressCode.code}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {dressCode.description}
          </p>
        </div>

        <div className="mt-9 flex flex-col items-center gap-4 border-t border-border/70 pt-8 sm:flex-row sm:justify-center">
          <span className="text-[0.62rem] uppercase tracking-luxe text-muted-foreground">
            {dressCode.reservedNote}
          </span>
          <ul className="flex items-center gap-5">
            {dressCode.reservedColors.map((color) => (
              <li key={color.hex} className="flex flex-col items-center gap-2">
                <span
                  className="h-8 w-8 rounded-full border border-border"
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Color reservado: ${color.name}`}
                  role="img"
                />
                <span className="text-[0.6rem] uppercase tracking-wide-luxe text-muted-foreground">
                  {color.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {dressCode.notes && (
          <p className="mt-8 border-t border-border/70 pt-8 text-center font-accent text-base italic text-muted-foreground">
            {dressCode.notes}
          </p>
        )}

        <div className="mt-9 grid grid-cols-2 gap-4">
          {dressCode.references.map((reference, position) => (
            <Reveal key={reference.alt} delay={position * 0.12}>
              <Image
                src={reference.src}
                alt={reference.alt}
                loading="lazy"
                className="h-40 w-full object-cover sm:h-56"
                fittingType="fill"
              />
            </Reveal>
          ))}
        </div>
      </Reveal>
    </SectionShell>
  );
}