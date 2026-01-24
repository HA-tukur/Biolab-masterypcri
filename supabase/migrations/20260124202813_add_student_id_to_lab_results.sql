/*
  # Add Student ID to Lab Results

  1. Changes
    - Add `student_id` column to lab_results table for anonymous student tracking
    - Make it nullable to support existing records
    - Add index for faster queries by student_id
  
  2. Notes
    - Student IDs are generated client-side (e.g., "BioUser-7b2a")
    - Stored in localStorage for session persistence
    - Combined with class_id for instructor dashboard analytics
*/

-- Add student_id column to lab_results
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_results' AND column_name = 'student_id'
  ) THEN
    ALTER TABLE lab_results ADD COLUMN student_id text;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lab_results_student_id ON lab_results(student_id);