/*
  # Create missions table

  1. New Tables
    - `missions`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - Original mission identifier (e.g., "DNA_EXT_A", "PCR_lagos-diagnostic")
      - `display_name` (text) - Certificate-friendly display name (e.g., "DNA Extraction", "PCR Amplification")
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `missions` table
    - Add policy for anyone to read missions (public reference data)
    - Add policy for inserting missions (public for now, can be restricted later)
  
  3. Initial Data
    - Populate with DNA Extraction missions mapping to "DNA Extraction"
    - Populate with PCR missions mapping to "PCR Amplification"
*/

-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read missions (public reference data)
CREATE POLICY "Anyone can read missions"
  ON missions
  FOR SELECT
  USING (true);

-- Allow anyone to insert missions (for seeding)
CREATE POLICY "Anyone can insert missions"
  ON missions
  FOR INSERT
  WITH CHECK (true);

-- Populate initial mission data
INSERT INTO missions (slug, display_name) VALUES
  ('DNA_EXT_A', 'DNA Extraction'),
  ('DNA_EXT_B', 'DNA Extraction'),
  ('DNA Extraction A - Superbug Clinical Diagnostic', 'DNA Extraction'),
  ('DNA Extraction B - Cassava Pathogen Sequencing', 'DNA Extraction'),
  ('Superbug Clinical Diagnostic', 'DNA Extraction'),
  ('Cassava Pathogen Sequencing', 'DNA Extraction'),
  ('PCR_lagos-diagnostic', 'PCR Amplification'),
  ('PCR_great-green-wall', 'PCR Amplification'),
  ('PCR - Lagos Diagnostic Hub (Sickle Cell)', 'PCR Amplification'),
  ('PCR - Great Green Wall Rescue (Drought Tolerance)', 'PCR Amplification'),
  ('Lagos Diagnostic Hub (Sickle Cell)', 'PCR Amplification'),
  ('Great Green Wall Rescue (Drought Tolerance)', 'PCR Amplification')
ON CONFLICT (slug) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_missions_slug ON missions(slug);