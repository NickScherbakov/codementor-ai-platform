import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../ui/utils";

interface HCRButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "tertiary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const HCRButton = forwardRef<HTMLButtonElement, HCRButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, children, disabled, ...props }, ref) => {
    const baseStyles = "font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-[#EF4444] text-white hover:bg-[#DC2626] hover:scale-105 hover:shadow-lg focus:ring-[#EF4444] rounded",
      secondary: "border-2 border-[#9CA3AF] text-[#D1D5DB] hover:bg-[#374151] focus:ring-[#9CA3AF] rounded",
      tertiary: "text-[#9CA3AF] hover:text-white hover:bg-[#374151] focus:ring-[#374151] rounded",
      danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] hover:scale-105 hover:shadow-lg focus:ring-[#DC2626] rounded",
      ghost: "text-[#D1D5DB] hover:bg-[#374151] focus:ring-[#374151] rounded"
    };

    const sizes = {
      sm: "text-xs py-2 px-3",
      md: "text-sm py-3 px-4",
      lg: "text-base py-4 px-6"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size],
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  }
);

HCRButton.displayName = "HCRButton";