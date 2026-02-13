/*
  # Fix classes table column naming

  1. Changes
    - Drop the `name` column if it exists (inconsistent with actual schema)
    - Ensure `class_name` is properly set up as the standard column
    - This resolves the "column classes.name does not exist" error

  2. Important Notes
    - The classes table should only use `class_name`, not `name`
    - This migration ensures consistency across the database
*/

-- Drop the name column if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'name'
  ) THEN
    ALTER TABLE classes DROP COLUMN name;
  END IF;
END $$;

-- Ensure class_name is NOT NULL if it isn't already
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' 
    AND column_name = 'class_name'
    AND is_nullable = 'YES'
  ) THEN
    -- First ensure no null values exist
    UPDATE classes SET class_name = 'Untitled Class' WHERE class_name IS NULL;
    -- Then set NOT NULL constraint
    ALTER TABLE classes ALTER COLUMN class_name SET NOT NULL;
  END IF;
END $$;