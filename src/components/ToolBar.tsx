"use client";

import { cva } from "class-variance-authority";
import { Plus, RefreshCcw, Pencil } from "lucide-react";

import { cn } from "@/utils/cssUtils";

const toolbarContainer = cva(
  "flex flex-col flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md sm:gap-4"
);

const toolbarButton = cva(
  "flex items-center justify-center gap-2 rounded-full py-2 font-bold text-2xl text-slate-700 hover:bg-slate-100 transition-colors duration-150",
  {
    variants: {
      active: {
        true: "bg-sky-200",
      },
    },
  }
);

export default function Toolbar({
  onNew,
  onSolve,
  onTogglePencil,
  pencilMode,
}: {
  onNew?: () => void;
  onSolve?: () => void;
  onTogglePencil?: () => void;
  pencilMode: boolean;
}) {
  return (
    <div className={cn(toolbarContainer())}>
      <button className={cn(toolbarButton())} onClick={onNew}>
        <Plus />
        <p>New</p>
      </button>
      <button className={cn(toolbarButton({ active: pencilMode }))} onClick={onTogglePencil}>
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
