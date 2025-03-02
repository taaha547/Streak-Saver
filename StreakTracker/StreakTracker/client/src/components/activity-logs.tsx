import { format } from "date-fns";
import { Activity } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { ActivityForm } from "./activity-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteActivity, editActivity } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";

interface ActivityLogsProps {
  activities: Activity[];
  selectedDate?: string;
  onActivityChange: () => void;
}

export function ActivityLogs({ activities, selectedDate, onActivityChange }: ActivityLogsProps) {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [deleteDate, setDeleteDate] = useState<string | null>(null);

  // Filter activities if selectedDate is provided
  const filteredActivities = selectedDate
    ? activities.filter(activity => activity.date === selectedDate)
    : activities;

  // Sort activities by date in descending order
  const sortedActivities = [...filteredActivities].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (content: string) => {
    if (editingDate) {
      editActivity(editingDate, content);
      setEditingDate(null);
      onActivityChange();
      toast({
        title: "Activity updated",
        description: "Your activity has been successfully updated."
      });
    }
  };

  const handleDelete = () => {
    if (deleteDate) {
      deleteActivity(deleteDate);
      setDeleteDate(null);
      onActivityChange();
      toast({
        title: "Activity deleted",
        description: "Your activity has been successfully deleted."
      });
    }
  };

  const title = selectedDate 
    ? `Activities for ${format(new Date(selectedDate), 'MMMM d, yyyy')}`
    : 'All Activities';

  return (
    <>
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <ScrollArea className="h-[300px] pr-4">
          {sortedActivities.length > 0 ? (
            <div className="space-y-4">
              {sortedActivities.map((activity, index) => (
                <div key={index} className="border-b pb-3 last:border-0">
                  {editingDate === activity.date ? (
                    <ActivityForm 
                      onSubmit={handleEdit}
                      defaultValue={activity.content}
                    />
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {format(new Date(activity.date), 'MMMM d, yyyy')}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingDate(activity.date)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDate(activity.date)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{activity.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              {selectedDate 
                ? "No activities recorded for this date."
                : "No activities recorded yet. Start your streak today!"}
            </p>
          )}
        </ScrollArea>
      </Card>

      <AlertDialog open={deleteDate !== null} onOpenChange={() => setDeleteDate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this activity? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}