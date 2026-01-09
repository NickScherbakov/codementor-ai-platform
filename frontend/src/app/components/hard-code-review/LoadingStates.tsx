import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ size = "md" }: LoadingSpinnerProps) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className={`${sizes[size]} text-[#EF4444] animate-spin`} />
    </div>
  );
}

interface SkeletonLoaderProps {
  count?: number;
}

export function SkeletonLoader({ count = 3 }: SkeletonLoaderProps) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-32 bg-[#374151] rounded" />
      ))}
    </div>
  );
}