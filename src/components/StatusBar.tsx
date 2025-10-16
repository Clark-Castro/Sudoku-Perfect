"use client";

import { cva } from "class-variance-authority";

import { cn } from "@/utils/cssUtils";

const containerClasses = cva(
  "flex w-full justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-md"
);

const timeClasses = cva("font-normal", {
  variants: {
    running: {
      true: "",
      false: "text-red-500 italic",
    },
  },
  defaultVariants: {
    running: true,
  },
});

export default function StatusBar({
  difficulty = "Medium",
  elapsedMs,
  running,
}: {
  difficulty?: string;
  elapsedMs: number;
  running: boolean;
}) {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn(containerClasses())}>
      <span className="font-semibold text-slate-800">
        Difficulty: <span className="font-normal text-sky-600">{difficulty}</span>
      </span>
      <span className="font-semibold text-slate-800">
        Time: <span className={cn(timeClasses({ running }))}>{formatTime(elapsedMs)}</span>
      </span>
    </div>
  );
}
