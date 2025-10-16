"use client";

import { cva } from "class-variance-authority";

import { NumType } from "@/types/types";
import { cn } from "@/utils/cssUtils";
import { Nums } from "@/utils/mathUtils";

const padContainer = cva(
  "grid grid-cols-9 gap-2 mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-xl backdrop-blur-md"
);

const padButton = cva(
  "flex items-center justify-center rounded-xl py-2 text-2xl font-bold text-slate-700 transition-colors hover:bg-sky-100 active:bg-sky-200"
);

type Props = {
  onInput: (num: NumType) => void;
  onErase?: () => void;
};

export default function NumberPad({ onInput, onErase }: Props) {
  return (
    <div className={cn(padContainer())}>
      {Nums.map((n) => (
        <button key={n} className={cn(padButton())} onClick={() => onInput(n as NumType)}>
          {n}
        </button>
      ))}
      <button
        onClick={onErase}
        className={cn(
          padButton(),
          "col-span-9 mt-2 bg-slate-100 text-base font-semibold hover:bg-slate-200"
        )}
      >
        Clear
      </button>
    </div>
  );
}
