import { Card } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { Activity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarViewProps {
  activities: Activity[];
  onDateSelect: (date: string) => void;
  selectedDate: string;
}

export function CalendarView({ activities, onDateSelect, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const nextMonth = () => {
    setCurrentMonth(current => addMonths(current, 1));
  };

  const previousMonth = () => {
    setCurrentMonth(current => subMonths(current, 1));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const hasActivity = activities.some(a => a.date === dateStr);
          const isSelected = dateStr === selectedDate;

          return (
            <Button
              key={dateStr}
              variant="ghost"
              className={cn(
                "h-10 w-full",
                hasActivity && "bg-primary/10",
                isSelected && "ring-2 ring-primary"
              )}
              onClick={() => onDateSelect(dateStr)}
            >
              {format(day, 'd')}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}