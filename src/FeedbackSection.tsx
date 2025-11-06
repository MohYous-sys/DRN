import { MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const feedbackSchema = z.object({
  name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters").optional().or(z.literal("")),
  category: z.string().nonempty("Please select a category"),
  feedback: z.string().trim().nonempty("Feedback cannot be empty").max(500, "Feedback must be less than 500 characters"),
});

const FeedbackSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    feedback: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      feedbackSchema.parse(formData);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it shortly.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        category: "",
        feedback: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const charCount = formData.feedback.length;

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-2xl">
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Share Your Feedback</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Help us improve our disaster response platform. Your insights make a difference in how we serve communities and donors.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm text-muted-foreground">
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={100}
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={255}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category" className="text-sm text-foreground mb-1 block">
                Feedback Category <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Feedback</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="bug">Report Issue</SelectItem>
                  <SelectItem value="donation">Donation Experience</SelectItem>
                  <SelectItem value="impact">Impact Tracking</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="feedback" className="text-sm text-foreground mb-1 block">
                Your Feedback <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, suggestions, or report issues..."
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                className="min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {charCount}/500 characters
              </p>
            </div>

            <Button type="submit" className="w-full" size="lg">
              <Send className="w-4 h-4" />
              Submit Feedback
            </Button>
          </form>

          <p className="text-sm text-center text-primary mt-6">
            We read every piece of feedback and use it to improve our platform and better serve disaster-affected communities.
          </p>
        </Card>
      </div>
    </section>
  );
};

export default FeedbackSection;
