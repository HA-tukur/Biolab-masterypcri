/*
  # Create instructor_requests table

  1. New Tables
    - `instructor_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users, unique)
      - `status` (text, default 'pending')
      - `message` (text, optional message from user)
      - `created_at` (timestamptz, auto-set)
      - `updated_at` (timestamptz, auto-updated)

  2. Security
    - Enable RLS on instructor_requests table
    - Users can SELECT their own request
    - Users can INSERT their own request (one per user)
    - Only one request per user allowed

  3. Important Notes
    - Status values: 'pending', 'approved', 'rejected'
    - Users can only create one request (enforced by UNIQUE constraint on user_id)
    - Admins will manually update status in database
*/

CREATE TABLE IF NOT EXISTS instructor_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE instructor_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own request"
  ON instructor_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own request"
  ON instructor_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_instructor_request_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_instructor_request_updated ON instructor_requests;
CREATE TRIGGER on_instructor_request_updated
  BEFORE UPDATE ON instructor_requests
  FOR EACH ROW
  EXECUTE FUNCTION handle_instructor_request_updated_at();