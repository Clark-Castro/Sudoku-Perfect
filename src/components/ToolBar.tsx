"use client";

import { Plus, RefreshCcw, Pencil } from "lucide-react";

import Button from "./Button";

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
    <div className="flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md sm:gap-4">
      <Button icon={Plus} label="New" onClick={onNew} />
      <Button icon={Pencil} label="Pencil" onClick={onTogglePencil} isActive={pencilMode} />
      <Button icon={RefreshCcw} label="Solve" onClick={onSolve} />
    </div>
  );
}
