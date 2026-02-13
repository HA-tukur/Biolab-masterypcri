/*
  # Update handle_new_user function

  1. Changes
    - Update handle_new_user function to include year_of_study and referral_source
    - These fields are now captured during signup and should be stored in profiles

  2. Important Notes
    - Function extracts additional fields from raw_user_meta_data
    - Uses COALESCE to handle optional fields gracefully
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, university, program_department, year_of_study, referral_source)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'program_department', ''),
    NULLIF(NEW.raw_user_meta_data->>'year_of_study', ''),
    NULLIF(NEW.raw_user_meta_data->>'referral_source', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
