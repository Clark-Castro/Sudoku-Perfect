"use client";

import { Undo2, Redo2, Plus, Lightbulb, RefreshCcw, Pencil } from "lucide-react";

import Button from "./Button";

export default function Toolbar({
  onNew,
  onUndo,
  onRedo,
  onHint,
  onSolve,
  onTogglePencil,
  pencilMode,
}: {
  onNew?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onHint?: () => void;
  onSolve?: () => void;
  onTogglePencil?: () => void;
  pencilMode: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-5 py-4 shadow-xl backdrop-blur-md sm:gap-4">
      <Button icon={Plus} label="New" onClick={onNew} />
      <Button icon={Undo2} label="Undo" onClick={onUndo} />
      <Button icon={Redo2} label="Redo" onClick={onRedo} />
      <Button icon={Pencil} label="Pencil" onClick={onTogglePencil} isActive={pencilMode} />
      <Button icon={Lightbulb} label="Hint" onClick={onHint} />
      <Button icon={RefreshCcw} label="Solve" onClick={onSolve} />
    </div>
  );
}
