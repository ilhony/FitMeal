-- Fix the infinite recursion in daily_progress RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view family members progress" ON public.daily_progress;

-- Create a fixed policy that doesn't cause recursion
CREATE POLICY "Users can view family members progress" 
ON public.daily_progress 
FOR SELECT 
USING (
  user_id IN (
    SELECT fm.user_id 
    FROM family_members fm
    WHERE fm.family_id IN (
      SELECT fm2.family_id 
      FROM family_members fm2 
      WHERE fm2.user_id = auth.uid()
    )
  )
);

-- Create weight_logs table for tracking weight over time
CREATE TABLE public.weight_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add weight goal columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS current_weight_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS goal_weight_kg DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS fitness_goal TEXT DEFAULT 'maintain';

-- Enable RLS on weight_logs
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for weight_logs
CREATE POLICY "Users can view their own weight logs" 
ON public.weight_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight logs" 
ON public.weight_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight logs" 
ON public.weight_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight logs" 
ON public.weight_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create workout_exercises table for gym workout plans
CREATE TABLE public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  exercise_name TEXT NOT NULL,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  weight_kg DECIMAL(5,2),
  completed BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on workout_exercises
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- RLS policies for workout_exercises
CREATE POLICY "Users can view their own exercises" 
ON public.workout_exercises 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercises" 
ON public.workout_exercises 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercises" 
ON public.workout_exercises 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercises" 
ON public.workout_exercises 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on workout_exercises
CREATE TRIGGER update_workout_exercises_updated_at
BEFORE UPDATE ON public.workout_exercises
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();