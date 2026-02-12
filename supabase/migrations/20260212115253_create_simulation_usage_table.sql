/*
  # Create simulation_usage table

  1. New Tables
    - `simulation_usage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `simulation_name` (text)
      - `started_at` (timestamptz)
      - `completed_at` (timestamptz, nullable)
      - `completed` (boolean)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `simulation_usage` table
    - Add policies for authenticated users to manage their own records
*/

CREATE TABLE IF NOT EXISTS simulation_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  simulation_name text NOT NULL,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE simulation_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own simulation usage"
  ON simulation_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own simulation usage"
  ON simulation_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own simulation usage"
  ON simulation_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_simulation_usage_user_id ON simulation_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_simulation_usage_completed ON simulation_usage(completed);
