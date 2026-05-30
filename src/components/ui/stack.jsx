import { cn } from "@/lib/utils";

export function Stack({ className, children, ...props }) {
  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export function Cluster({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
