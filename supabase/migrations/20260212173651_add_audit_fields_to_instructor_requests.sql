/*
  # Add audit fields to instructor_requests table

  1. Changes
    - Add `decision_by_admin_id` (uuid, references auth.users)
    - Add `decision_at` (timestamptz)
    - These fields track which admin approved/rejected the request and when

  2. Security
    - No RLS policy changes needed
    - These fields will only be updated by server-side code using service role key

  3. Important Notes
    - Fields are nullable since they're only set when a decision is made
    - decision_by_admin_id links to the admin user who made the decision
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'decision_by_admin_id'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN decision_by_admin_id uuid REFERENCES auth.users(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_requests' AND column_name = 'decision_at'
  ) THEN
    ALTER TABLE instructor_requests ADD COLUMN decision_at timestamptz;
  END IF;
END $$;
