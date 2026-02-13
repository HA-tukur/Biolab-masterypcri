/*
  # Update profiles table constraints

  1. Changes
    - Remove 'Noblekinmat' from referral_source CHECK constraint
    - Update referral_source allowed values to: 'WhatsApp Group', 'Lecturer', 'Friend', 'Social Media', 'AMR-ITP', 'Other'

  2. Important Notes
    - Drops and recreates the constraint to update allowed values
    - Existing data is not modified
*/

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_referral_source_check;

ALTER TABLE profiles ADD CONSTRAINT profiles_referral_source_check 
  CHECK (referral_source IN ('WhatsApp Group','Lecturer','Friend','Social Media','AMR-ITP','Other'));
