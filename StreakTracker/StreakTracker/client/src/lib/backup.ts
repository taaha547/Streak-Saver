import { Activity } from "@shared/schema";
import { format } from "date-fns";
import { getActivities } from "./storage";

export async function exportToMarkdown() {
  const activities = getActivities();
  
  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.date);
    const year = format(date, 'yyyy');
    const month = format(date, 'MM-MMMM');
    const day = format(date, 'dd');
    
    acc[year] = acc[year] || {};
    acc[year][month] = acc[year][month] || {};
    acc[year][month][day] = acc[year][month][day] || [];
    acc[year][month][day].push(activity);
    
    return acc;
  }, {} as Record<string, Record<string, Record<string, Activity[]>>>);

  // Create markdown files
  for (const [year, months] of Object.entries(groupedActivities)) {
    for (const [month, days] of Object.entries(months)) {
      for (const [day, dayActivities] of Object.entries(days)) {
        const content = generateMarkdownContent(dayActivities, `${year}-${month}-${day}`);
        const path = `${year}/${month}/${day}.md`;
        
        try {
          // Use the Blob API to create and download the file
          const blob = new Blob([content], { type: 'text/markdown' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = path;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } catch (error) {
          console.error(`Failed to save file: ${path}`, error);
        }
      }
    }
  }
}

function generateMarkdownContent(activities: Activity[], date: string): string {
  return `# Activity Log - ${date}\n\n${activities
    .map(
      activity => `## Activity\n- Content: ${activity.content}\n- Completed: ${
        activity.completed ? '✅' : '❌'
      }\n`
    )
    .join('\n')}`;
}
