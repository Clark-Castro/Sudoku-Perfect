"use client";

import { cva } from "class-variance-authority";
import { Plus, RefreshCcw, Pencil } from "lucide-react";

import { cn } from "@/utils/cssUtils";

const toolbarContainer = cva(
  "flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md sm:gap-4"
);

const toolbarButton = cva(
  "flex items-center gap-2 rounded-md px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 transition-colors duration-150",
  {
    variants: {
      size: {
        sm: "text-sm gap-1 px-2 py-1",
        md: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export default function Toolbar({
  onNew,
  onSolve,
  onTogglePencil,
}: {
  onNew?: () => void;
  onSolve?: () => void;
  onTogglePencil?: () => void;
}) {
  return (
    <div className={cn(toolbarContainer())}>
      <button className={cn(toolbarButton())} onClick={onNew}>
        <Plus />
        <p>New</p>
      </button>
      <button className={cn(toolbarButton())} onClick={onTogglePencil}>
        <Pencil />
        <p>Pencil</p>
      </button>
      <button className={cn(toolbarButton())} onClick={onSolve}>
        <RefreshCcw />
        <p>Solve</p>
      </button>
    </div>
  );
}
