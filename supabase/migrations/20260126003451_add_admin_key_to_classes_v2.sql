/*
  # Add admin_key column to classes table

  1. Changes
    - Add `admin_key` column to `classes` table
    - Generate admin keys for existing classes
    - Make it unique and NOT NULL
    - Admin keys follow format: ADM-XXXX (where X is alphanumeric)

  2. Purpose
    - Allows instructors to save and resume their sessions using a private admin key
    - Provides secure access control for instructor dashboard

  3. Security
    - Admin key is separate from student class code
    - Unique constraint ensures one-to-one mapping
*/

DO $$
BEGIN
  -- Add column as nullable first
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'admin_key'
  ) THEN
    ALTER TABLE classes ADD COLUMN admin_key text;
    
    -- Generate admin keys for existing rows
    UPDATE classes 
    SET admin_key = 'ADM-' || substring(md5(random()::text || id::text) from 1 for 4)
    WHERE admin_key IS NULL;
    
    -- Now make it NOT NULL and UNIQUE
    ALTER TABLE classes 
    ALTER COLUMN admin_key SET NOT NULL;
    
    ALTER TABLE classes 
    ADD CONSTRAINT classes_admin_key_key UNIQUE (admin_key);
  END IF;
END $$;
