import { FlameIcon } from "./ui/flame-icon";
import { Streak } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface StreakDisplayProps {
  streak: Streak;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  const isActive = streak.lastActivityDate === format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className="p-4 flex items-center gap-3">
      <FlameIcon size={32} animate={streak.count > 0} isActive={isActive} />
      <div>
        <p className="text-lg font-bold">{streak.count} Day Streak</p>
        <p className="text-sm text-muted-foreground">
          {streak.count > 0 
            ? "Keep it going!" 
            : "Start your streak today!"}
        </p>
      </div>
    </Card>
  );
}