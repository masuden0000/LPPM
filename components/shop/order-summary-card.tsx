import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SummaryRow = {
  label: string;
  value: string;
};

type OrderSummaryCardProps = {
  title: string;
  rows: SummaryRow[];
  totalLabel: string;
  totalValue: string;
  action?: ReactNode;
  footer?: ReactNode;
  stickyTopClassName?: string;
  className?: string;
};

export function OrderSummaryCard({
  title,
  rows,
  totalLabel,
  totalValue,
  action,
  footer,
  stickyTopClassName = "top-24",
  className,
}: OrderSummaryCardProps) {
  return (
    <Card className={cn("sticky rounded-xl border border-border p-6 shadow-sm", stickyTopClassName, className)}>
      <h2 className="mb-6 text-xl font-bold text-foreground">{title}</h2>

      <div className="mb-6 flex flex-col gap-3 border-b border-border pb-6">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <span className="text-base text-muted-foreground">{row.label}</span>
            <span className="text-base font-medium text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      <div className={cn("flex items-end justify-between", action || footer ? "mb-8" : undefined)}>
        <span className="text-lg font-bold text-foreground">{totalLabel}</span>
        <span className="text-2xl font-bold tracking-tight text-foreground">{totalValue}</span>
      </div>

      {action}
      {footer ? <div className={cn(action ? "mt-4" : undefined)}>{footer}</div> : null}
    </Card>
  );
}
