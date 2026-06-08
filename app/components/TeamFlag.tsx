"use client";

interface TeamFlagProps {
  name: string;
  flag: string;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TeamFlag({ name, flag, showName = true, size = "md" }: TeamFlagProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses[size]}`}>
      <span className="select-none">{flag}</span>
      {showName && <span>{name}</span>}
    </span>
  );
}
