import { cn } from "@/lib/utils";

interface IconProps {
  type: "fontawesome" | "image" | "emoji";
  value: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}

export function Icon({
  type,
  value,
  size = "md",
  className,
  ariaLabel,
}: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  switch (type) {
    case "fontawesome":
      return <i className={cn(value, className)} />;
    case "image":
      return (
        <img
          src={value}
          alt="Icon"
          className={cn(sizeClasses[size], className)}
        />
      );
    case "emoji":
      return (
        <span
          className={cn(sizeClasses[size], className)}
          role="img"
          aria-label={ariaLabel}
        >
          {value}
        </span>
      );
    default:
      return null;
  }
}
