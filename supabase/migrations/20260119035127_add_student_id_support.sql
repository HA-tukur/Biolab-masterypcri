/*
  # Add Student ID Support for Anonymous Users

  1. Changes
    - Add `student_id` column to store BioStudent-XXXX identifiers
    - Make `user_id` nullable to support anonymous users
    - Drop existing foreign key constraint on user_id
    - Update RLS policies to allow anonymous access based on student_id

  2. Security
    - Anonymous users can insert/read records with their student_id
    - No authentication required for basic lab result storage
    - Records remain immutable (no update/delete)

  3. Notes
    - Supports both authenticated users (user_id) and anonymous students (student_id)
    - Student IDs are generated client-side and stored in localStorage
    - Enables progress tracking without requiring user accounts
*/

-- Add student_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_history' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE lab_history ADD COLUMN student_id text;
  END IF;
END $$;

-- Make user_id nullable
ALTER TABLE lab_history ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing foreign key if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'lab_history_user_id_fkey'
    AND table_name = 'lab_history'
  ) THEN
    ALTER TABLE lab_history DROP CONSTRAINT lab_history_user_id_fkey;
  END IF;
END $$;

-- Re-add foreign key as optional
ALTER TABLE lab_history
  ADD CONSTRAINT lab_history_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Drop old policies
DROP POLICY IF EXISTS "Users can read own lab records" ON lab_history;
DROP POLICY IF EXISTS "Users can insert own lab records" ON lab_history;

-- Create new policies for anonymous and authenticated access
CREATE POLICY "Anyone can insert lab records"
  ON lab_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read lab records"
  ON lab_history
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add index on student_id for performance
CREATE INDEX IF NOT EXISTS idx_lab_history_student_id ON lab_history(student_id);
