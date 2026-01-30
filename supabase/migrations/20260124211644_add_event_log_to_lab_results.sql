/*
  # Add Event Log Column to Lab Results

  1. Changes
    - Add `event_log` column (JSONB) to `lab_results` table for storing student errors and events
    - This column will store an array of error/event objects from lab sessions

  2. Purpose
    - Enable instructors to analyze common student errors
    - Provide data for error analytics dashboard visualizations
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_results' AND column_name = 'event_log'
  ) THEN
    ALTER TABLE lab_results ADD COLUMN event_log jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;