/*
  # Update profiles table for unified signup

  1. Changes
    - Add instructor_verified column (boolean, default false)
    - Add classes_quota column (integer, default 0)
    - Update year_of_study CHECK constraint with new values
    - Update referral_source CHECK constraint with new values

  2. New Columns
    - `instructor_verified` (boolean): Tracks whether an instructor has been verified by admin
    - `classes_quota` (integer): Number of classes instructor can create (0 for regular users)

  3. Updated Constraints
    - year_of_study: Now includes all levels from Undergraduate Year 1-5 to Industry Professional
    - referral_source: Updated with new referral sources including social media, conferences, etc.

  4. Important Notes
    - All existing users will have instructor_verified = false and classes_quota = 0
    - These fields will be updated by admin when verifying instructors
    - Everyone starts as a regular user regardless of their year_of_study value
*/

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'instructor_verified'
  ) THEN
    ALTER TABLE profiles ADD COLUMN instructor_verified boolean DEFAULT false NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'classes_quota'
  ) THEN
    ALTER TABLE profiles ADD COLUMN classes_quota integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Update year_of_study constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_year_of_study_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_year_of_study_check 
  CHECK (year_of_study IN (
    'Undergraduate (Year 1)',
    'Undergraduate (Year 2)',
    'Undergraduate (Year 3)',
    'Undergraduate (Year 4)',
    'Undergraduate (Year 5)',
    'Masters Student',
    'PhD Student',
    'Postdoctoral Researcher',
    'Faculty/Instructor',
    'Lab Technician',
    'Industry Professional',
    'Other'
  ));

-- Update referral_source constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_referral_source_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_referral_source_check 
  CHECK (referral_source IN (
    'Lecturer/Professor Recommendation',
    'Friend/Colleague',
    'Social Media (LinkedIn, Twitter, etc.)',
    'WhatsApp/Telegram Group',
    'Google Search',
    'University/Program Announcement',
    'Conference/Workshop',
    'Other'
  ));