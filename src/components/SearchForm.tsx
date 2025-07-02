import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  position: string;
  skills: string;
  location: string;
}

export const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    position: "",
    skills: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field: keyof SearchFilters) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFilters(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-border">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Position / Job Title
              </label>
              <Input
                placeholder="e.g. Software Engineer, Product Manager"
                value={filters.position}
                onChange={handleInputChange("position")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Skills (comma separated)
              </label>
              <Input
                placeholder="e.g. React, Python, AWS"
                value={filters.skills}
                onChange={handleInputChange("skills")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Location
              </label>
              <Input
                placeholder="e.g. San Francisco, Remote"
                value={filters.location}
                onChange={handleInputChange("location")}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full md:w-auto px-8"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Jobs
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};