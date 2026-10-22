import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROCEDURES, PROC_BY_ID, type Procedure } from "@/lib/data/procedures";
import { ProcedureDetail } from "@/components/procedures/ProcedurePages";

export function generateStaticParams() {
  return PROCEDURES.map((p) => ({ id: p.id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/procedures/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = PROC_BY_ID[id as Procedure["id"]];
  return { title: p ? `${p.name} (${p.abbr})` : "Procedure" };
}

export default async function ProcedurePage({ params }: PageProps<"/procedures/[id]">) {
  const { id } = await params;
  if (!PROC_BY_ID[id as Procedure["id"]]) notFound();
  return <ProcedureDetail id={id as Procedure["id"]} />;
}
