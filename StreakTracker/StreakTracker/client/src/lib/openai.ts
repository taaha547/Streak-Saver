import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getAIResponse(messages: Message[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  } catch (error) {
    console.error('Error getting AI response:', error);
    throw new Error('Failed to get AI response');
  }
}

export async function generateChecklist(category: "daily" | "weekly" | "monthly" | "yearly", context: string): Promise<ChecklistItem[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Generate a ${category} checklist based on the following context. Respond with a JSON array of checklist items.`
        },
        {
          role: "user",
          content: context
        }
      ],
      response_format: { type: "json_object" }
    });

    const items = JSON.parse(response.choices[0].message.content || "[]");
    return items.map((item: any) => ({
      id: nanoid(),
      content: item.task,
      completed: false,
      category,
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error generating checklist:', error);
    throw new Error('Failed to generate checklist');
  }
}

export async function analyzeActivity(activity: string): Promise<{
  suggestions: string[];
  category: string;
  priority: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Analyze the given activity and provide suggestions, category, and priority (1-5). Respond in JSON format."
        },
        {
          role: "user",
          content: activity
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error('Error analyzing activity:', error);
    throw new Error('Failed to analyze activity');
  }
}
