/*
  # Add real_name column to leaderboard_profiles

  1. Changes
    - Add `real_name` (text, nullable) column to `leaderboard_profiles` table
    - This stores the student's actual name for certificate display
    - Separate from `display_name` which is shown on leaderboards
  
  2. Notes
    - `real_name` is optional and used for certificate personalization
    - `display_name` remains for leaderboard/public display
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leaderboard_profiles' AND column_name = 'real_name'
  ) THEN
    ALTER TABLE leaderboard_profiles ADD COLUMN real_name text;
  END IF;
END $$;