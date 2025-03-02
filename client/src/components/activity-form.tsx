import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ActivityFormProps {
  onSubmit: (content: string) => void;
  defaultValue?: string;
}

export function ActivityForm({ onSubmit, defaultValue = "" }: ActivityFormProps) {
  const form = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      content: defaultValue,
      date: format(new Date(), 'yyyy-MM-dd'),
      completed: true
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data.content);
          form.reset();
          toast({
            title: "Activity logged!",
            description: "Keep up the great work!"
          });
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What did you accomplish today?"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Log Activity
        </Button>
      </form>
    </Form>
  );
}
