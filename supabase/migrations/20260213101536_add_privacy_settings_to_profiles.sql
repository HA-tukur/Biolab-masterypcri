/*
  # Add privacy settings to profiles table

  1. New Columns
    - `leaderboard_visible` (boolean, default true): Controls whether user appears on leaderboard
    - `display_name_preference` (text, default 'real_name'): How user appears on leaderboard
      Options: 'real_name' | 'student_id' | 'custom_nickname'
    - `custom_nickname` (text, nullable): Custom display name if preference is 'custom_nickname'
    - `learning_path` (text, default 'independent'): User's selected learning path
      Options: 'university' | 'independent' | 'pre_university'
    - `onboarding_completed` (boolean, default false): Whether user has completed onboarding

  2. Important Notes
    - All existing users get default values
    - leaderboard_visible defaults to true for backward compatibility
    - display_name_preference defaults to 'real_name'
    - learning_path defaults to 'independent'
*/

-- Add privacy and preferences columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'leaderboard_visible'
  ) THEN
    ALTER TABLE profiles ADD COLUMN leaderboard_visible boolean DEFAULT true NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'display_name_preference'
  ) THEN
    ALTER TABLE profiles ADD COLUMN display_name_preference text DEFAULT 'real_name' NOT NULL
      CHECK (display_name_preference IN ('real_name', 'student_id', 'custom_nickname'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'custom_nickname'
  ) THEN
    ALTER TABLE profiles ADD COLUMN custom_nickname text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'learning_path'
  ) THEN
    ALTER TABLE profiles ADD COLUMN learning_path text DEFAULT 'independent' NOT NULL
      CHECK (learning_path IN ('university', 'independent', 'pre_university'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'onboarding_completed'
  ) THEN
    ALTER TABLE profiles ADD COLUMN onboarding_completed boolean DEFAULT false NOT NULL;
  END IF;
END $$;
