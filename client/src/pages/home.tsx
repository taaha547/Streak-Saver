import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Activity } from "@shared/schema";
import { ActivityForm } from "@/components/activity-form";
import { CalendarView } from "@/components/calendar-view";
import { StreakDisplay } from "@/components/streak-display";
import { ActivityLogs } from "@/components/activity-logs";
import { InteractiveChecklist } from "@/components/interactive-checklist";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getActivities, saveActivity, getStreak, getActivityForDate } from "@/lib/storage";
import { exportToMarkdown } from "@/lib/backup";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const streak = getStreak();

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  const handleSubmit = (content: string) => {
    const activity: Activity = {
      date: format(new Date(), 'yyyy-MM-dd'),
      content,
      completed: true
    };

    saveActivity(activity);
    setActivities(getActivities());
  };

  const handleActivityChange = () => {
    setActivities(getActivities());
  };

  const handleBackup = async () => {
    try {
      await exportToMarkdown();
      toast({
        title: "Backup completed",
        description: "Your activity logs have been exported to markdown files."
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "Failed to export activity logs. Please try again.",
        variant: "destructive"
      });
    }
  };

  const selectedActivity = getActivityForDate(selectedDate);

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackup}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Backup Logs
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StreakDisplay streak={streak} />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ActivityForm onSubmit={handleSubmit} />
              {selectedActivity && selectedDate !== format(new Date(), 'yyyy-MM-dd') && (
                <Card className="p-4">
                  <h3 className="font-medium mb-2">Activity for {format(new Date(selectedDate), 'MMM d, yyyy')}</h3>
                  <p className="text-muted-foreground">{selectedActivity.content}</p>
                </Card>
              )}
            </div>
            <CalendarView
              activities={activities}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>
          <ActivityLogs 
            activities={activities} 
            selectedDate={selectedDate}
            onActivityChange={handleActivityChange}
          />
        </div>
        <div>
          <InteractiveChecklist />
        </div>
      </div>
    </div>
  );
}