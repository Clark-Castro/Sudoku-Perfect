"use client";

import { ComponentType, SVGProps } from "react";

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement> & { title?: string }>;

export default function Button({
  icon: Icon,
  label,
  onClick,
  isActive = false,
}: {
  icon: SvgIconComponent;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-3 shadow-sm transition-all active:scale-95 ${
        isActive
          ? "bg-blue-500 text-white hover:bg-blue-600"
          : "bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600"
      }`}
      type="button"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
