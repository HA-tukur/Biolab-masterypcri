/*
  # Update handle_new_user function to include learning_type

  1. Changes
    - Update handle_new_user function to extract and store learning_type
    - This field is captured during signup and stored in profiles
  
  2. Notes
    - Uses COALESCE with default of 'independent_learner'
    - This is metadata only and does not restrict features
*/

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, learning_type, university, program_department, year_of_study, referral_source)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'learning_type', 'independent_learner'),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'program_department', ''),
    NULLIF(NEW.raw_user_meta_data->>'year_of_study', ''),
    NULLIF(NEW.raw_user_meta_data->>'referral_source', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
