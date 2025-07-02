import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, ExternalLink, Globe } from "lucide-react";

interface JobSource {
  id: string;
  name: string;
  url: string;
  source_type: "company" | "job_board";
  is_active: boolean;
  created_at: string;
}

interface JobSourcesListProps {
  refreshTrigger?: number;
}

export const JobSourcesList = ({ refreshTrigger }: JobSourcesListProps) => {
  const [sources, setSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSources = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setSources([]);
        return;
      }

      const { data, error } = await supabase
        .from("job_sources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setSources((data || []) as JobSource[]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load job sources.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSource = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from your job sources?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("job_sources")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSources(prev => prev.filter(source => source.id !== id));
      
      toast({
        title: "Source removed",
        description: `${name} has been removed from your job sources.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove job source.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSources();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading job sources...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Your Job Sources ({sources.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg mb-2">No job sources added yet</p>
            <p className="text-sm">Add company career pages and job boards to start curating jobs.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-foreground truncate">{source.name}</h4>
                    <Badge variant={source.source_type === "company" ? "default" : "secondary"}>
                      {source.source_type === "company" ? "Company" : "Job Board"}
                    </Badge>
                    {source.is_active && (
                      <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{source.url}</p>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(source.url, "_blank")}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSource(source.id, source.name)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};