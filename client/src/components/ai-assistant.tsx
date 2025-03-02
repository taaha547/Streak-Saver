import { useState, useEffect, useRef } from "react";
import { Message, Conversation, ChecklistItem } from "@shared/schema";
import { getAIResponse, generateChecklist, analyzeActivity } from "@/lib/openai";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getConversations, saveConversation, createNewConversation } from "@/lib/storage";
import { Loader2, Send, Plus, ListChecks } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export function AIAssistant() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [checklistType, setChecklistType] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  useEffect(() => {
    const loadedConversations = getConversations();
    setConversations(loadedConversations);
    if (loadedConversations.length > 0) {
      setCurrentConversation(loadedConversations[0]);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]);

  const handleNewConversation = () => {
    const newConversation = createNewConversation(`Conversation ${conversations.length + 1}`);
    setConversations(prev => [...prev, newConversation]);
    setCurrentConversation(newConversation);
    saveConversation(newConversation);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !currentConversation) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setIsLoading(true);
    try {
      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, userMessage],
        updatedAt: new Date().toISOString(),
      };
      setCurrentConversation(updatedConversation);
      saveConversation(updatedConversation);
      setInput("");

      const aiResponse = await getAIResponse([...updatedConversation.messages]);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date().toISOString(),
      };
      setCurrentConversation(finalConversation);
      saveConversation(finalConversation);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChecklist = async () => {
    if (!currentConversation) return;
    
    setIsLoading(true);
    try {
      const checklistItems = await generateChecklist(
        checklistType,
        currentConversation.messages.map(m => m.content).join("\n")
      );
      
      toast({
        title: "Checklist Generated",
        description: `Created ${checklistItems.length} ${checklistType} checklist items`,
      });
      
      // You can handle the generated checklist items here
      console.log(checklistItems);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate checklist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="flex items-center justify-between p-4 border-b">
        <Select
          value={currentConversation?.id}
          onValueChange={(value) => {
            const conv = conversations.find(c => c.id === value);
            if (conv) setCurrentConversation(conv);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select conversation" />
          </SelectTrigger>
          <SelectContent>
            {conversations.map((conv) => (
              <SelectItem key={conv.id} value={conv.id}>
                {conv.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleNewConversation}>
            <Plus className="h-4 w-4" />
          </Button>
          <Select value={checklistType} onValueChange={(value: any) => setChecklistType(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Checklist type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleGenerateChecklist}
            disabled={isLoading || !currentConversation}
          >
            <ListChecks className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {currentConversation?.messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {format(new Date(message.timestamp), "HH:mm")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading || !currentConversation}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !currentConversation || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
