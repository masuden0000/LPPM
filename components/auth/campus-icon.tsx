"use client";

import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";

import { getCampusIconSources } from "@/lib/mock-content";

type CampusIconProps = {
  className?: string;
  imageClassName?: string;
};

export function CampusIcon({ className, imageClassName }: CampusIconProps) {
  const sources = useMemo(() => getCampusIconSources(), []);
  const [sourceIndex, setSourceIndex] = useState(0);
  const currentSource = sources[sourceIndex];

  if (!currentSource) {
    return (
      <div className={className}>
        <Building2 className={imageClassName} />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Try common file extensions so the public asset can be swapped without code changes. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSource}
        alt="Ikon kampus"
        className={imageClassName}
        onError={() => setSourceIndex((prev) => prev + 1)}
      />
    </div>
  );
}
