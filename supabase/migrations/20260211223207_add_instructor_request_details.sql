/*
  # Add detailed fields to instructor_requests table

  1. Changes
    - Add `department` (text, required)
    - Add `course_taught` (text, required)
    - Add `student_count` (text, required)
    - Add `university_email` (text, optional)
    - Add `reason` (text, required)
    - Rename `created_at` to `requested_at` for clarity
    - Remove old `message` field (replaced by structured fields)

  2. Important Notes
    - All new fields capture detailed information about the instructor's teaching role
    - Student count is stored as text to match dropdown options (e.g., "30-50", "50-100")
    - University email is optional for those who signed up with personal emails
    - Reason field limited to 500 characters on frontend
*/

DO $$
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'department'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN department text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'course_taught'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN course_taught text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'student_count'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN student_count text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'university_email'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN university_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'reason'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'requested_at'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN requested_at timestamptz DEFAULT now();
  END IF;
END $$;