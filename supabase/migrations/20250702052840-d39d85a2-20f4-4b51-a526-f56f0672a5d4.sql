-- Create table for job source websites
CREATE TABLE public.job_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'company' CHECK (source_type IN ('company', 'job_board')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.job_sources ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own job sources" 
ON public.job_sources 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own job sources" 
ON public.job_sources 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job sources" 
ON public.job_sources 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job sources" 
ON public.job_sources 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_job_sources_updated_at
BEFORE UPDATE ON public.job_sources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();