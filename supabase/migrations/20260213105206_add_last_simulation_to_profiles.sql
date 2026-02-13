/*
  # Add last_simulation field to profiles table

  1. Changes
    - Add `last_simulation` (text, optional) - stores the last accessed simulation name
    - This allows the Resume button to take users directly to their last simulation

  2. Important Notes
    - Field is optional (nullable) as new users won't have accessed any simulation yet
    - Will be updated whenever user starts or resumes a simulation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'last_simulation'
  ) THEN
    ALTER TABLE profiles ADD COLUMN last_simulation text;
  END IF;
END $$;
