interface WeeklyChallengeCardProps {
  title: string;
  current: number;
  target: number;
  daysLeft: number;
  participants: number;
}

export const WeeklyChallengeCard = ({
  title,
  current,
  target,
  daysLeft,
  participants,
}: WeeklyChallengeCardProps) => {
  const percentage = Math.min(100, (current / target) * 100);

  return (
    <div className="bg-primary rounded-2xl p-5 text-primary-foreground">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-wider opacity-80">Weekly Challenge</p>
          <h2 className="text-xl font-bold mt-1">{title}</h2>
        </div>
        <span className="px-3 py-1 bg-primary-foreground/20 rounded-full text-sm font-medium">
          {daysLeft} Days Left
        </span>
      </div>

      <div className="flex items-center justify-between text-sm mb-2">
        <span>{current.toLocaleString()} steps</span>
        <span>{target.toLocaleString()}</span>
      </div>

      <div className="w-full h-2 bg-primary-foreground/30 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-primary-foreground rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[...Array(Math.min(3, participants))].map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-primary-foreground/40 border-2 border-primary flex items-center justify-center text-xs font-bold"
            >
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        {participants > 3 && (
          <span className="px-2 py-1 bg-primary-foreground/20 rounded-full text-xs font-medium">
            +{participants - 3}
          </span>
        )}
      </div>
    </div>
  );
};
