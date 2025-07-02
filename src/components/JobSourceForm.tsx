import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Link } from "lucide-react";

interface JobSourceFormProps {
  onSourceAdded?: () => void;
}

export const JobSourceForm = ({ onSourceAdded }: JobSourceFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    sourceType: "company" as "company" | "job_board",
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.url.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // URL validation
    try {
      new URL(formData.url);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add job sources.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("job_sources")
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          url: formData.url.trim(),
          source_type: formData.sourceType,
        });

      if (error) throw error;

      toast({
        title: "Source added",
        description: `${formData.name} has been added to your job sources.`,
      });

      // Reset form
      setFormData({
        name: "",
        url: "",
        sourceType: "company",
      });

      onSourceAdded?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job source. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Add Job Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Source Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Google Careers, Microsoft Jobs"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sourceType">Source Type</Label>
              <Select
                value={formData.sourceType}
                onValueChange={(value: "company" | "job_board") => 
                  setFormData(prev => ({ ...prev, sourceType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="company">Company Career Page</SelectItem>
                  <SelectItem value="job_board">Job Board</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://careers.company.com"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            {isSubmitting ? "Adding..." : "Add Source"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};