/*
  # Add learning type to profiles

  1. Changes
    - Add `learning_type` column to `profiles` table
    - Values: 'university_student', 'independent_learner', 'pre_university'
    - Default: 'independent_learner'
    - This is metadata only - does not restrict features
  
  2. Notes
    - All users can access all features regardless of learning type
    - Used for analytics and personalization only
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'learning_type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN learning_type text DEFAULT 'independent_learner' CHECK (learning_type IN ('university_student', 'independent_learner', 'pre_university'));
  END IF;
END $$;
