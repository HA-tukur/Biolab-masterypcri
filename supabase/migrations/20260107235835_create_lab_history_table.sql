/*
  # BioSim Lab History Storage

  1. New Tables
    - `lab_history`
      - `id` (uuid, primary key) - Unique identifier for each lab record
      - `user_id` (uuid) - Anonymous user ID from Supabase Auth
      - `mission` (text) - Mission title (e.g., "Superbug Clinical Diagnostic")
      - `concentration` (numeric) - Final DNA concentration in ng/µL
      - `purity` (text) - A260/280 purity ratio
      - `status` (text) - Mission outcome: MASTERY, UNVERIFIED, or FAIL
      - `created_at` (timestamptz) - Timestamp of lab session completion

  2. Security
    - Enable RLS on `lab_history` table
    - Policy: Users can only read their own lab records
    - Policy: Users can insert their own lab records
    - Policy: Users cannot update or delete records (immutable audit trail)

  3. Notes
    - This table stores all completed lab sessions for progress tracking
    - Data is isolated per anonymous user session
    - Records are immutable to maintain historical accuracy
*/

CREATE TABLE IF NOT EXISTS lab_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission text NOT NULL,
  concentration numeric NOT NULL,
  purity text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own lab records"
  ON lab_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab records"
  ON lab_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_lab_history_user_id ON lab_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_history_created_at ON lab_history(created_at DESC);