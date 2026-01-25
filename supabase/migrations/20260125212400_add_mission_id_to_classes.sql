/*
  # Add Mission ID to Classes Table

  1. Changes to Existing Tables
    - `classes`
      - Add `mission_id` (text) - The mission/lab module selected by the instructor for this session
        - Examples: "DNA_EXT_A", "DNA_EXT_B", "PCR_A", "PCR_B"
        - This allows the instructor to specify which lab students should be directed to when they join

  2. Notes
    - This enables instructor-led sessions where students are automatically directed to the correct lab module
    - The mission_id is stored as text for flexibility to support any future lab modules
*/

-- Add mission_id column to classes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'mission_id'
  ) THEN
    ALTER TABLE classes ADD COLUMN mission_id text;
  END IF;
END $$;

-- Create index for faster queries by mission_id
CREATE INDEX IF NOT EXISTS idx_classes_mission_id ON classes(mission_id);
