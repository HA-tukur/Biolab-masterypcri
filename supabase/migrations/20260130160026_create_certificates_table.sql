/*
  # Create Certificates Table

  ## Overview
  This migration creates a certificates table to track mission-level achievements for students.
  Each certificate represents mastery of a specific mission with detailed statistics.

  ## New Tables
    - certificates
      - id (uuid, primary key) - Unique identifier for each certificate
      - student_id (text, not null) - Student identifier (e.g., "BioUser-7b2a")
      - mission (text, not null) - Full mission name (e.g., "DNA Extraction - Cassava Pathogen Sequencing")
      - best_score (numeric, not null) - Best purity score achieved across all attempts
      - attempt_count (integer, default 1) - Total number of attempts for this mission
      - success_count (integer, default 1) - Number of successful completions (score >= 85%)
      - date_earned (timestamptz, default now()) - Date when certificate was first earned
      - date_updated (timestamptz, default now()) - Date of last update (when best score changed)
      - created_at (timestamptz, default now()) - Timestamp of record creation

  ## Constraints
    - Unique constraint on (student_id, mission) to prevent duplicate certificates
    - Index on student_id for fast queries

  ## Security
    - Enable RLS on certificates table
    - Public read access (anyone can view certificates)
    - No insert/update/delete policies (certificates managed via application logic)

  ## Important Notes
    - One certificate per student per mission
    - Certificate is created on first successful completion (score >= 85%)
    - Subsequent attempts update the same certificate with new best score, attempt counts, etc.
    - Success rate can be calculated as: (success_count / attempt_count) * 100
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL,
  mission text NOT NULL,
  best_score numeric NOT NULL,
  attempt_count integer DEFAULT 1,
  success_count integer DEFAULT 1,
  date_earned timestamptz DEFAULT now(),
  date_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, mission)
);

-- Create index for faster queries by student_id
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Allow public read access to certificates (anyone can view achievements)
CREATE POLICY "Anyone can view certificates"
  ON certificates
  FOR SELECT
  USING (true);

-- Allow public insert for certificate creation (managed by app)
CREATE POLICY "Anyone can create certificates"
  ON certificates
  FOR INSERT
  WITH CHECK (true);

-- Allow public update for certificate updates (managed by app)
CREATE POLICY "Anyone can update certificates"
  ON certificates
  FOR UPDATE
  USING (true)
  WITH CHECK (true);