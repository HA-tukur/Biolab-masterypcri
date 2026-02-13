/*
  # Update classes table for unified authentication

  1. Changes to classes table
    - Add `instructor_id` (uuid, references profiles) - Links to instructor profile
    - Add `name` (text) - Standardized class name field
    - Add `simulation_name` (text) - Name of assigned simulation
    - Migrate data from old columns to new columns
    - Keep old columns for backward compatibility initially

  2. Changes to class_enrollments table
    - Add `completed` (boolean, default false) - Tracks if student completed the class simulation

  3. Important Notes
    - instructor_id links to profiles table for proper user relationships
    - name replaces class_name for consistency
    - simulation_name stores the assigned simulation/mission
    - completed tracks student progress
*/

-- Add new columns to classes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'instructor_id'
  ) THEN
    ALTER TABLE classes ADD COLUMN instructor_id uuid REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'name'
  ) THEN
    ALTER TABLE classes ADD COLUMN name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'simulation_name'
  ) THEN
    ALTER TABLE classes ADD COLUMN simulation_name text;
  END IF;
END $$;

-- Migrate existing data: copy class_name to name
UPDATE classes SET name = class_name WHERE name IS NULL;

-- Add completed column to class_enrollments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'class_enrollments' AND column_name = 'completed'
  ) THEN
    ALTER TABLE class_enrollments ADD COLUMN completed boolean DEFAULT false NOT NULL;
  END IF;
END $$;

-- Create index for instructor_id for faster queries
CREATE INDEX IF NOT EXISTS idx_classes_instructor_id ON classes(instructor_id);