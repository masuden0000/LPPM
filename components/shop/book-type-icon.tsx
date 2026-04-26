"use client";

import {
  BookText,
  Brain,
  BookOpenText,
  Briefcase,
  Cpu,
  FileText,
  FlaskConical,
  GraduationCap,
  Landmark,
  LayoutGrid,
  LibraryBig,
  Newspaper,
  ScrollText,
  Wrench,
  type LucideIcon,
} from "lucide-react";

type BookTypeKey =
  | "all"
  | "journal"
  | "textbook"
  | "report"
  | "monograph"
  | "proceeding"
  | "teknologi"
  | "bisnis"
  | "sains"
  | "teknik"
  | "sastra"
  | "novel"
  | "sejarah"
  | "psikologi"
  | "default";

type BookTypeIconProps = {
  type: string;
  className?: string;
};

function resolveBookType(type: string): BookTypeKey {
  const normalized = type.trim().toLowerCase();

  if (normalized === "semua" || normalized === "all books") return "all";
  if (normalized.includes("journal")) return "journal";
  // Handle common typo variants like "textboot" from manual labels.
  if (normalized.includes("textbook") || normalized.includes("textboot")) return "textbook";
  if (normalized.includes("report")) return "report";
  if (normalized.includes("monograph")) return "monograph";
  if (normalized.includes("proceeding")) return "proceeding";
  if (normalized.includes("teknologi")) return "teknologi";
  if (normalized.includes("bisnis")) return "bisnis";
  if (normalized.includes("sains")) return "sains";
  if (normalized.includes("teknik")) return "teknik";
  if (normalized.includes("sastra")) return "sastra";
  if (normalized.includes("novel")) return "novel";
  if (normalized.includes("sejarah")) return "sejarah";
  if (normalized.includes("psikologi")) return "psikologi";
  return "default";
}

const iconMap: Record<BookTypeKey, LucideIcon> = {
  all: LayoutGrid,
  journal: Newspaper,
  textbook: GraduationCap,
  report: FileText,
  monograph: LibraryBig,
  proceeding: ScrollText,
  teknologi: Cpu,
  bisnis: Briefcase,
  sains: FlaskConical,
  teknik: Wrench,
  sastra: BookText,
  novel: BookOpenText,
  sejarah: Landmark,
  psikologi: Brain,
  default: BookOpenText,
};

export function BookTypeIcon({ type, className }: BookTypeIconProps) {
  const Icon = iconMap[resolveBookType(type)];
  return <Icon className={className} aria-hidden="true" />;
}
