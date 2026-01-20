-- Create a table to store generated meals for each day
CREATE TABLE public.generated_meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  title TEXT NOT NULL,
  ingredients TEXT NOT NULL,
  calories INTEGER NOT NULL,
  tag TEXT NOT NULL,
  protein INTEGER NOT NULL DEFAULT 0,
  carbs INTEGER NOT NULL DEFAULT 0,
  fat INTEGER NOT NULL DEFAULT 0,
  time TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, date, meal_type)
);

-- Enable Row Level Security
ALTER TABLE public.generated_meals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own meals"
ON public.generated_meals
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meals"
ON public.generated_meals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals"
ON public.generated_meals
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals"
ON public.generated_meals
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_generated_meals_updated_at
BEFORE UPDATE ON public.generated_meals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();