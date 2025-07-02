import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  salary?: string;
  type: string;
  skills: string[];
  description: string;
  source: "Indeed" | "Glassdoor" | "Company";
  postedDate: string;
  applyUrl: string;
  companyLogo?: string;
}

export const JobCard = ({
  title,
  company,
  location,
  salary,
  type,
  skills,
  description,
  source,
  postedDate,
  applyUrl,
  companyLogo,
}: JobCardProps) => {
  const getSourceColor = (source: string) => {
    switch (source) {
      case "Indeed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Glassdoor":
        return "bg-green-100 text-green-800 border-green-200";
      case "Company":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-border bg-gradient-to-b from-card to-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={`${company} logo`}
                className="w-12 h-12 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">
                  {company.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                {title}
              </h3>
              <p className="text-muted-foreground font-medium">{company}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span>{location}</span>
                <span>•</span>
                <span>{type}</span>
                {salary && (
                  <>
                    <span>•</span>
                    <span className="text-foreground font-medium">{salary}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="outline"
              className={`text-xs ${getSourceColor(source)}`}
            >
              {source}
            </Badge>
            <span className="text-xs text-muted-foreground">{postedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{skills.length - 5} more
            </Badge>
          )}
        </div>
        <Button
          variant="success"
          className="w-full"
          onClick={() => window.open(applyUrl, "_blank")}
        >
          Apply Now
        </Button>
      </CardContent>
    </Card>
  );
};