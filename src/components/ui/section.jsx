import { cn } from "@/lib/utils";

export function Section({ className, children, ...props }) {
  return (
    <section className={cn("px-5 py-20 sm:px-6 md:px-10 md:py-28", className)} {...props}>
      {children}
    </section>
  );
}

export function Container({ className, children, ...props }) {
  return (
    <div className={cn("max-w-7xl mx-auto", className)} {...props}>
      {children}
    </div>
  );
}

export function Grid({ className, children, ...props }) {
  return (
    <div className={cn("grid", className)} {...props}>
      {children}
    </div>
  );
}
