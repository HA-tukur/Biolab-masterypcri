/*
  # Create Lab Sessions Table

  1. New Tables
    - `lab_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `student_id` (text, not null) - Student's unique identifier
      - `class_id` (uuid, foreign key) - Reference to the class
      - `last_active` (timestamptz) - Last activity timestamp
      - `created_at` (timestamptz) - When the session was created
      - Unique constraint on (student_id, class_id) to prevent duplicate enrollments

  2. Security
    - Enable RLS on `lab_sessions` table
    - Allow anyone to read sessions (for checking enrollment status)
    - Allow anyone to insert sessions (for joining classes)
    - Allow anyone to update sessions (for activity tracking)

  3. Indexes
    - Index on student_id for faster lookups
    - Index on class_id for dashboard queries
*/

-- Create lab_sessions table
CREATE TABLE IF NOT EXISTS lab_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  last_active timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, class_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lab_sessions_student_id ON lab_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_lab_sessions_class_id ON lab_sessions(class_id);

-- Enable RLS on lab_sessions table
ALTER TABLE lab_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lab_sessions' AND policyname = 'Anyone can read sessions'
  ) THEN
    CREATE POLICY "Anyone can read sessions"
      ON lab_sessions
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Policy: Anyone can create sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lab_sessions' AND policyname = 'Anyone can create sessions'
  ) THEN
    CREATE POLICY "Anyone can create sessions"
      ON lab_sessions
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- Policy: Anyone can update sessions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'lab_sessions' AND policyname = 'Anyone can update sessions'
  ) THEN
    CREATE POLICY "Anyone can update sessions"
      ON lab_sessions
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;