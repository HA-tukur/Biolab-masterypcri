/*
  # Create lab_results table

  1. New Tables
    - `lab_results`
      - `id` (uuid, primary key) - Unique identifier for each result
      - `mission` (text) - Mission name (e.g., "DNA Extraction from Human Tissue")
      - `purity_score` (numeric) - Purity score (e.g., 1.88)
      - `status` (text) - Status text (e.g., "Verified Mastery" or "Mission Failed")
      - `created_at` (timestamptz) - Timestamp of when the result was recorded
  
  2. Security
    - RLS is disabled as requested by user
*/

CREATE TABLE IF NOT EXISTS lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mission text NOT NULL,
  purity_score numeric NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);