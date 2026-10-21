import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Callout, Card, PageHeader } from "@/components/ui/primitives";
import { REFERENCES } from "@/lib/data/references";

export const metadata: Metadata = { title: "References & Disclaimer" };

export default function ReferencesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sources"
        title="References & disclaimer"
        description="BronchoSim content is paraphrased and synthesised from the sources below. No figures or text are reproduced; all images in the app are procedurally generated."
      />
      <Callout tone="warn" title="Educational use only" className="mb-6">
        BronchoSim is a learning aid for trainees in pulmonary medicine. It does not provide medical advice, is not a validated
        assessment tool, and does not replace supervised hands-on training, manufacturer instructions for use, or institutional
        protocols. Thresholds (platelets, INR, drug holding windows) vary between guidelines and centres — verify locally.
        The anatomical model is schematic.
      </Callout>
      <Card>
        <ol className="divide-y divide-line">
          {REFERENCES.map((r, i) => (
            <li key={r.id} id={r.id} className="flex gap-3 px-4 py-3 text-sm">
              <span className="w-6 shrink-0 font-mono text-xs text-muted">{i + 1}.</span>
              <div className="flex-1">
                <p className="text-slate-200">{r.citation}</p>
                <p className="mt-0.5 text-[11px] text-cyan-400/80">
                  cited as “{r.short}”
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 hover:underline">
                      link <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}
