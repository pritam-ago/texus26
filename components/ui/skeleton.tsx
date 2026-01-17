import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-tr from-gray-900 to-gray-800/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
