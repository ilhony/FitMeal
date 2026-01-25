-- Allow joining by invite code without exposing full family circle access.
-- This function returns only id + name for a matching invite code.

CREATE OR REPLACE FUNCTION public.get_family_by_invite_code(_invite_code text)
RETURNS TABLE(id uuid, name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT fc.id, fc.name
  FROM public.family_circles fc
  WHERE fc.invite_code = lower(trim(_invite_code))
  LIMIT 1;
$$;

-- Only authenticated users should be able to call this.
REVOKE EXECUTE ON FUNCTION public.get_family_by_invite_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_family_by_invite_code(text) TO authenticated;