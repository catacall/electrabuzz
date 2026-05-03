interface ScoreDisplayProps {
  score: number;
  total: number;
  size?: "sm" | "lg";
}

export default function ScoreDisplay({
  score,
  total,
  size = "sm",
}: ScoreDisplayProps) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const color =
    percentage >= 70
      ? "text-emerald-500"
      : percentage >= 40
        ? "text-amber-500"
        : "t-muted";

  if (size === "lg") {
    return (
      <div className={`text-xl font-bold ${color}`}>
        Your Score: {score} / {total}
      </div>
    );
  }

  return (
    <span className={`text-sm font-bold ${color}`} aria-label={`Score: ${score} out of ${total}`}>
      Score: {score}/{total}
    </span>
  );
}
