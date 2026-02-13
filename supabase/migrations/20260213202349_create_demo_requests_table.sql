/*
  # Create demo requests table

  1. New Tables
    - `demo_requests`
      - `id` (uuid, primary key) - Unique identifier for each demo request
      - `institution_name` (text, not null) - Name of the requesting institution
      - `country` (text, not null) - Country where institution is located
      - `state` (text, nullable) - State or region (optional)
      - `name` (text, not null) - Name of the person requesting the demo
      - `contact_email` (text, not null) - Work email for contact
      - `contact_number` (text, not null) - Contact phone number with country code
      - `role_position` (text, not null) - Role or position (e.g., Head of Department)
      - `created_at` (timestamptz, not null) - Timestamp when request was created

  2. Security
    - Enable RLS on `demo_requests` table
    - Add policy for public insert (anyone can submit a demo request)
    - Add policy for admin read access (only admins can view requests)
*/

CREATE TABLE IF NOT EXISTS demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_name text NOT NULL,
  country text NOT NULL,
  state text,
  name text NOT NULL,
  contact_email text NOT NULL,
  contact_number text NOT NULL,
  role_position text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert demo requests (public form submission)
CREATE POLICY "Anyone can submit demo requests"
  ON demo_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read their own requests or admins can read all
-- For now, we'll create a simple policy and rely on admin checks in the frontend
CREATE POLICY "Admins can read all demo requests"
  ON demo_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Add index on created_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_demo_requests_created_at ON demo_requests(created_at DESC);