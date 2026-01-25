-- Create a security definer function to check family membership without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_family_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT family_id FROM public.family_members WHERE user_id = _user_id
$$;

-- Create a function to get all user_ids in the same family as a user
CREATE OR REPLACE FUNCTION public.get_family_member_user_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT fm.user_id 
  FROM public.family_members fm
  WHERE fm.family_id IN (SELECT family_id FROM public.family_members WHERE user_id = _user_id)
$$;

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view members of their family" ON public.family_members;
DROP POLICY IF EXISTS "Users can view family members progress" ON public.daily_progress;

-- Recreate family_members SELECT policy using security definer function
CREATE POLICY "Users can view members of their family"
ON public.family_members
FOR SELECT
USING (
  family_id IN (SELECT public.get_user_family_ids(auth.uid()))
  OR user_id = auth.uid()
);

-- Recreate daily_progress SELECT policy for family members using security definer function
CREATE POLICY "Users can view family members progress"
ON public.daily_progress
FOR SELECT
USING (
  user_id IN (SELECT public.get_family_member_user_ids(auth.uid()))
);