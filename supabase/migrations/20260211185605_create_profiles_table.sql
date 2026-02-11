/*
  # Create profiles table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, copied from auth.users for convenience)
      - `full_name` (text, required)
      - `university` (text, required)
      - `program_department` (text, required)
      - `year_of_study` (text, optional with constraints)
      - `referral_source` (text, optional with constraints)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-updated)

  2. Security
    - Enable RLS on profiles table
    - Users can SELECT their own profile
    - Users can UPDATE their own profile
    - Manual INSERT is blocked (profiles created via trigger only)

  3. Automation
    - Function to auto-create profile when user signs up
    - Trigger on auth.users to call the function
    - Function to auto-update updated_at timestamp
    - Trigger on profiles to update timestamp

  4. Important Notes
    - Profile creation is automatic via trigger
    - Prevents duplicate profiles
    - Uses SECURITY DEFINER for elevated privileges
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text NOT NULL,
  university text NOT NULL,
  program_department text NOT NULL,
  year_of_study text CHECK (year_of_study IN ('100L','200L','300L','400L','500L','MSc','PhD','Lecturer','Lab Technician','Staff')),
  referral_source text CHECK (referral_source IN ('WhatsApp Group','Lecturer','Friend','Social Media','AMR-ITP','Noblekinmat','Other')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, university, program_department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'university', ''),
    COALESCE(NEW.raw_user_meta_data->>'program_department', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
