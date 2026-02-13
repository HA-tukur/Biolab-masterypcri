/*
  # Create class_enrollments table

  1. New Tables
    - `class_enrollments`
      - `id` (uuid, primary key)
      - `class_id` (uuid, references classes)
      - `user_id` (uuid, references auth.users)
      - `student_id` (text, optional student ID)
      - `enrolled_at` (timestamptz, auto-set)
      - Unique constraint on (class_id, user_id) to prevent duplicate enrollments

  2. Security
    - Enable RLS on class_enrollments table
    - Authenticated users can SELECT enrollments for classes they're in
    - Authenticated users can INSERT to enroll themselves
    - Users cannot UPDATE or DELETE enrollments (only admins via direct DB access)

  3. Important Notes
    - Tracks which users are enrolled in which classes
    - Used to display "My Classes" on student dashboard
    - Prevents duplicate enrollments with unique constraint
*/

CREATE TABLE IF NOT EXISTS class_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_id text,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(class_id, user_id)
);

ALTER TABLE class_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments"
  ON class_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves"
  ON class_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);