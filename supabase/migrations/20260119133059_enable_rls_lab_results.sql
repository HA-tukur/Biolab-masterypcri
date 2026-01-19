/*
  # Enable RLS on lab_results table

  1. Security Changes
    - Enable Row Level Security on `lab_results` table
    - Add policy to allow anyone (including anonymous users) to insert results
    - Add policy to allow anyone to view all results

  This allows the lab simulation to save mission results and view past results
  without requiring authentication.
*/

-- Enable RLS
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert results (for saving mission completions)
CREATE POLICY "Anyone can insert lab results"
  ON lab_results
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view results (for viewing past completions)
CREATE POLICY "Anyone can view lab results"
  ON lab_results
  FOR SELECT
  TO anon, authenticated
  USING (true);