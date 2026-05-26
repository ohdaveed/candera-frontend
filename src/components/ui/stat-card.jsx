import { memo } from "react";
import { Link } from "react-router-dom";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils.js";

const statCardVariants = cva(
  "relative rounded-xl border bg-card text-card-foreground overflow-hidden shadow-sm transition-all duration-300",
  {
    variants: {
      interactive: {
        true: "hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      },
    },
    defaultVariants: {
      interactive: false,
    },
  },
);

const statValueVariants = cva(
  "text-3xl font-black tabular-nums leading-none tracking-tighter animate-in fade-in slide-in-from-bottom-1 duration-700",
  {
    variants: {
      accent: {
        red: "text-destructive",
        yellow: "text-amber-500",
        green: "text-green-500",
        blue: "text-primary",
        purple: "text-purple-500",
      },
    },
    defaultVariants: {
      accent: undefined,
    },
  },
);

const statIconVariants = cva(
  "flex-shrink-0 size-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
  {
    variants: {
      accent: {
        red: "text-destructive/50",
        yellow: "text-amber-500/50",
        green: "text-green-500/50",
        blue: "text-primary/50",
        purple: "text-purple-500/50",
      },
    },
    defaultVariants: {
      accent: undefined,
    },
  },
);

const StatCard = memo(function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
  to,
  onClick,
  className,
}) {
  const interactive = !!(to || onClick);

  const content = (
    <div className="p-4 flex flex-col gap-3 group">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
          {label}
        </p>
        {icon && <span className={statIconVariants({ accent })}>{icon}</span>}
      </div>
      <p className={statValueVariants({ accent })}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {sub && (
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          {sub}
        </p>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={cn(statCardVariants({ interactive: true }), className)}>
        {content}
      </Link>
    );
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(statCardVariants({ interactive }), className)}
    >
      {content}
    </div>
  );
});

export { StatCard };
