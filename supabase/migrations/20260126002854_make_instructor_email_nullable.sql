/*
  # Make instructor_email nullable

  1. Changes
    - Alter `classes` table to make `instructor_email` column nullable
    - This allows instructors to create classes without providing an email address

  2. Reason
    - The InstructorSetup form does not collect email addresses
    - The NOT NULL constraint on instructor_email was causing insert failures
*/

ALTER TABLE classes 
ALTER COLUMN instructor_email DROP NOT NULL;
