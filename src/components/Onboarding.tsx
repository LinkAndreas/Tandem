'use client';

import { useSettings } from "@/lib/settings";
import Dialog from "./Dialog";
import { Avatar, Button } from "./ui";

type Props = {
  open: boolean;
  onClose: () => void;
  onTryExample: () => void;
};

export default function Onboarding({ open, onClose, onTryExample }: Props) {
  const { t } = useSettings();

  return (
    <Dialog open={open} onClose={onClose} labelledBy="welcome-title">
      <div className="bg-accent-soft px-6 pt-8 pb-6 sm:px-8">
        <div className="flex items-center gap-3" aria-hidden="true">
          {[t.sampleNames.slice(0, 2), t.sampleNames.slice(2, 4)].map((pair) => (
            <div key={pair.join()} className="flex -space-x-2">
              {pair.map((name) => (
                <Avatar key={name} name={name} size="lg" className="ring-4 ring-accent-soft" />
              ))}
            </div>
          ))}
        </div>
        <h2 id="welcome-title" className="mt-5 font-display text-3xl font-semibold tracking-tight">
          {t.welcomeTitle}
        </h2>
        <p className="mt-2 text-base leading-relaxed text-muted">{t.welcomeIntro}</p>
      </div>

      <div className="px-6 py-6 sm:px-8">
        <ol className="space-y-4">
          {t.welcomeSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-semibold text-on-accent">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-muted">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <svg viewBox="0 0 20 20" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="9" width="12" height="8" rx="2" />
            <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
          </svg>
          {t.welcomePrivacy}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={() => {
              onTryExample();
              onClose();
            }}
          >
            {t.tryExample}
          </Button>
          <Button variant="primary" onClick={onClose} autoFocus>
            {t.welcomeStart}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
