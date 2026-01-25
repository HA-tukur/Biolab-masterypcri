/*
  # Create Classes Table for Instructor Dashboard

  1. New Tables
    - `classes`
      - `id` (uuid, primary key) - Unique class identifier
      - `instructor_name` (text) - Name of the instructor
      - `instructor_email` (text) - Instructor's email address
      - `class_name` (text) - Name of the class (e.g., "Molecular Biology 301")
      - `class_code` (text, unique) - Unique code students use to join (e.g., "MOLB-XY7Z")
      - `created_at` (timestamp) - When the class was created
  
  2. Changes to Existing Tables
    - `lab_results`
      - Add `class_id` (uuid, foreign key) - Links results to a class (nullable for anonymous practice)
      - Add index on `class_id` for faster dashboard queries
  
  3. Security
    - Enable RLS on `classes` table
    - Allow anyone to read classes by code (for dashboard lookup)
    - Allow anyone to insert classes (for MVP - instructor setup without auth)
*/

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_name text NOT NULL,
  instructor_email text NOT NULL,
  class_name text NOT NULL,
  class_code text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add class_id to lab_results table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_results' AND column_name = 'class_id'
  ) THEN
    ALTER TABLE lab_results ADD COLUMN class_id uuid REFERENCES classes(id);
  END IF;
END $$;

-- Create index for faster dashboard queries
CREATE INDEX IF NOT EXISTS idx_lab_results_class_id ON lab_results(class_id);

-- Enable RLS on classes table
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read classes (needed for dashboard lookup)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'classes' AND policyname = 'Anyone can read classes'
  ) THEN
    CREATE POLICY "Anyone can read classes"
      ON classes
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Policy: Anyone can create classes (MVP - no auth required)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'classes' AND policyname = 'Anyone can create classes'
  ) THEN
    CREATE POLICY "Anyone can create classes"
      ON classes
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;