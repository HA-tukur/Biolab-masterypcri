/*
  # Add Score Column to Lab History

  1. Changes
    - Add `score` column to store the purity score as a numeric value
    - This allows for easier filtering and analysis of results

  2. Notes
    - Score represents the A260/280 purity ratio
    - Used to quickly identify mastery vs failure without parsing text
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_history' AND column_name = 'score'
  ) THEN
    ALTER TABLE lab_history ADD COLUMN score numeric;
  END IF;
END $$;
