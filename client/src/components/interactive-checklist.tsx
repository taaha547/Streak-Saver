import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Circle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
}

export function InteractiveChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([{ id: '1', content: '', completed: false }]);

  const handleContentChange = (id: string, content: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, content } : item
      )
    );
  };

  const toggleComplete = (id: string) => {
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Add new item if the current item has content
      const currentItem = items.find(item => item.id === id);
      if (currentItem?.content.trim()) {
        setItems(current => [
          ...current,
          { id: Date.now().toString(), content: '', completed: false }
        ]);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    // If backspace is pressed on an empty item
    if (e.key === 'Backspace' && items.length > 1) {
      const currentItem = items.find(item => item.id === id);
      if (currentItem && !currentItem.content.trim()) {
        e.preventDefault();
        setItems(current => current.filter(item => item.id !== id));
      }
    }
  };

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Daily Checklist</h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <button
              onClick={() => toggleComplete(item.id)}
              disabled={!item.content.trim()}
              className={cn(
                "hover:text-primary transition-colors",
                !item.content.trim() && "opacity-50 cursor-not-allowed",
                item.completed && "text-primary"
              )}
            >
              {item.completed ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <input
              type="text"
              value={item.content}
              onChange={(e) => handleContentChange(item.id, e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, item.id)}
              onKeyDown={(e) => handleKeyDown(e, item.id)}
              placeholder="Add new item..."
              className="flex-1 bg-transparent border-none focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}