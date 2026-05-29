import { cn } from "@/lib/utils";

export function Overlay({ className, children, ...props }) {
  return (
    <div className={cn("absolute inset-0", className)} {...props}>
      {children}
    </div>
  );
}
