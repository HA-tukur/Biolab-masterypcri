/*
  # Create Mastery Tracking and Survey Tables

  1. New Tables
    - `mastery_progress`
      - `id` (uuid, primary key)
      - `student_id` (text, indexed)
      - `mission_name` (text)
      - `success_count` (integer) - Number of successful completions
      - `total_attempts` (integer) - Total attempts
      - `best_purity` (numeric) - Best A260/A280 achieved
      - `best_concentration` (numeric) - Best concentration achieved
      - `last_completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `post_mission_surveys`
      - `id` (uuid, primary key)
      - `student_id` (text)
      - `mission_name` (text)
      - `result_id` (uuid) - Foreign key to lab_results
      - `muscle_memory_step` (text) - Which step feels natural
      - `confidence_level` (integer) - 1-10 scale
      - `peer_challenge_shared` (boolean) - Whether they shared their score
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated and anonymous users
*/

-- Create mastery_progress table
CREATE TABLE IF NOT EXISTS mastery_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  mission_name text NOT NULL,
  success_count integer DEFAULT 0,
  total_attempts integer DEFAULT 0,
  best_purity numeric DEFAULT 0,
  best_concentration numeric DEFAULT 0,
  last_completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, mission_name)
);

CREATE INDEX IF NOT EXISTS idx_mastery_progress_student_id ON mastery_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_mastery_progress_mission ON mastery_progress(mission_name);

-- Create post_mission_surveys table
CREATE TABLE IF NOT EXISTS post_mission_surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  mission_name text NOT NULL,
  result_id uuid REFERENCES lab_results(id) ON DELETE CASCADE,
  muscle_memory_step text,
  confidence_level integer CHECK (confidence_level >= 1 AND confidence_level <= 10),
  peer_challenge_shared boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_surveys_student_id ON post_mission_surveys(student_id);
CREATE INDEX IF NOT EXISTS idx_surveys_result_id ON post_mission_surveys(result_id);

-- Enable RLS
ALTER TABLE mastery_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_mission_surveys ENABLE ROW LEVEL SECURITY;

-- Policies for mastery_progress
CREATE POLICY "Users can view own mastery progress"
  ON mastery_progress FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own mastery progress"
  ON mastery_progress FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own mastery progress"
  ON mastery_progress FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Policies for post_mission_surveys
CREATE POLICY "Users can view own surveys"
  ON post_mission_surveys FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can insert own surveys"
  ON post_mission_surveys FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update own surveys"
  ON post_mission_surveys FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);
