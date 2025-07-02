import { useState } from "react";
import { SearchForm, SearchFilters } from "@/components/SearchForm";
import { JobCard } from "@/components/JobCard";
import { mockJobs } from "@/data/mockJobs";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [searchResults, setSearchResults] = useState(mockJobs);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (filters: SearchFilters) => {
    // Filter jobs based on search criteria
    const filtered = mockJobs.filter(job => {
      const matchesPosition = !filters.position || 
        job.title.toLowerCase().includes(filters.position.toLowerCase());
      
      const matchesLocation = !filters.location || 
        job.location.toLowerCase().includes(filters.location.toLowerCase());
      
      const skillsArray = filters.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      const matchesSkills = skillsArray.length === 0 || 
        skillsArray.some(searchSkill => 
          job.skills.some(jobSkill => 
            jobSkill.toLowerCase().includes(searchSkill)
          )
        );

      return matchesPosition && matchesLocation && matchesSkills;
    });

    setSearchResults(filtered);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">N</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">NextGig</h1>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              Your unified job search portal
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-5"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Find Your
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Next Gig</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Aggregate jobs from Glassdoor, Indeed and company career pages into one clean, 
            personalized view. Search once, find everywhere.
          </p>
          <div className="mb-8">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-foreground">
                {searchResults.length} Jobs Found
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Indeed</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span>Glassdoor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span>Company</span>
                </div>
              </div>
            </div>
            
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {searchResults.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No jobs found matching your criteria. Try adjusting your search filters.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      {!hasSearched && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Why Choose NextGig?
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Save time with our unified job search experience that aggregates listings 
                from multiple sources.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">🔍</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Unified Search
                </h4>
                <p className="text-muted-foreground">
                  Search across Indeed, Glassdoor, and company career pages in one place.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">🎯</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Smart Filtering
                </h4>
                <p className="text-muted-foreground">
                  Advanced filters help you find exactly what you're looking for.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-xl">⚡</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Direct Apply
                </h4>
                <p className="text-muted-foreground">
                  Apply directly through the original job posting with one click.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 NextGig. Streamlining your job search experience.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
