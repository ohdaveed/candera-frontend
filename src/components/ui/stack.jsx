import { cn } from "@/lib/utils";

export function Stack({ as: Component = "div", className, children, ...props }) {
  return (
    <Component className={cn("flex flex-col", className)} {...props}>
      {children}
    </Component>
  );
}

export function Cluster({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
}
