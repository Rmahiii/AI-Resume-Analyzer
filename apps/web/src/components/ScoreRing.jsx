export function ScoreRing({ score, label, tone = "blue" }) {
  const background = `conic-gradient(var(--ring) ${score}%, rgba(113,113,122,.18) 0)`;
  const color = tone === "green" ? "#3d8b6e" : tone === "gold" ? "#b7791f" : "#2854a1";
  return (
    <div className="grid justify-items-center gap-2">
      <div
        className="grid aspect-square w-[108px] place-items-center rounded-full p-2"
        style={{ background, "--ring": color }}
      >
        <div className="grid h-full w-full place-items-center rounded-full bg-white text-center dark:bg-[#11161d]">
          <span className="text-3xl font-bold">{score}</span>
        </div>
      </div>
      <span className="text-center text-sm text-zinc-600 dark:text-zinc-300">{label}</span>
    </div>
  );
}
