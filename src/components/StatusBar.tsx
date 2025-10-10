"use client";

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

  const timeClass = `font-normal ${running ? "" : "text-red-500 italic"}`;

  return (
    <div className="flex w-full justify-between rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-md">
      <span className="font-semibold text-slate-800">
        Difficulty:
        <span className="font-normal text-sky-600">{difficulty}</span>
      </span>
      <span className="font-semibold text-slate-800">
        Time: <span className={timeClass}>{formatTime(elapsedMs)}</span>
      </span>
    </div>
  );
}
