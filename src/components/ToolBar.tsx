"use client";

import { Plus, RefreshCcw, Pencil } from "lucide-react";

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
    <div className="flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md sm:gap-4">
      <button className="flex" onClick={onNew}>
        <Plus />
        <p>New</p>
      </button>
      <button className="flex" onClick={onTogglePencil}>
        <Pencil />
        <p>Pencil</p>
      </button>
      <button className="flex" onClick={onSolve}>
        <RefreshCcw />
        <p>Solve</p>
      </button>
    </div>
  );
}
