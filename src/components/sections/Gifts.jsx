import React from 'react';
import { CreditCard, ExternalLink, Gift, Mail } from 'lucide-react';
import SectionShell from '@/components/common/SectionShell';
import SectionHeading from '@/components/common/SectionHeading';
import Reveal from '@/components/common/Reveal';
import { weddingConfig } from '@/config/wedding';

const ICONS = { Gift, Mail, CreditCard };

function GiftCard({ gift, delay }) {
  const Icon = ICONS[gift.icon] || Gift;

  return (
    <Reveal delay={delay} className="flex h-full flex-col border border-border/80 bg-background p-7">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/50">
        <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      </span>

      <h3 className="mt-5 font-heading text-xl text-foreground">{gift.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{gift.description}</p>

      {gift.detail && (
        <p className="mt-4 text-xs uppercase tracking-wide-luxe text-foreground">{gift.detail}</p>
      )}

      {(gift.bank || gift.clabe) && (
        <dl className="mt-4 space-y-1.5 rounded-sm bg-secondary/40 p-4 text-xs text-foreground">
          {gift.bank && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Banco</dt>
              <dd className="text-right">{gift.bank}</dd>
            </div>
          )}
          {gift.holder && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Titular</dt>
              <dd className="text-right">{gift.holder}</dd>
            </div>
          )}
          {gift.clabe && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">CLABE</dt>
              <dd className="text-right tabular-nums">{gift.clabe}</dd>
            </div>
          )}
          {gift.account && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Cuenta</dt>
              <dd className="text-right tabular-nums">{gift.account}</dd>
            </div>
          )}
        </dl>
      )}

      {gift.isDemo && (
        <p className="mt-3 text-[0.62rem] uppercase tracking-wide-luxe text-primary">
          Datos de demostración · se sustituyen por los reales
        </p>
      )}

      {gift.url && (
        <a
          href={gift.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 border border-primary px-5 py-2.5 text-[0.66rem] uppercase tracking-wide-luxe text-foreground transition hover:bg-primary hover:text-primary-foreground"
        >
          {gift.linkLabel || 'Ver más'}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </Reveal>
  );
}

/** Mesa de regalos y opciones para los invitados. */
export default function Gifts() {
  const { gifts, texts } = weddingConfig;
  const visibleGifts = gifts.filter((gift) => gift.enabled !== false);

  return (
    <SectionShell id="mesa-de-regalos" tone="champagne">
      <SectionHeading
        kicker="Mesa de regalos"
        title={texts.giftsTitle}
        subtitle={texts.giftsSubtitle}
      />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {visibleGifts.map((gift, position) => (
          <GiftCard key={gift.id} gift={gift} delay={position * 0.12} />
        ))}
      </div>
    </SectionShell>
  );
}