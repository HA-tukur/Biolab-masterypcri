/*
  # Add Anonymous User Support for Lab History

  1. Changes
    - Update RLS policies to support both authenticated and anonymous users
    - Anonymous users (created via signInAnonymously) have auth.uid() but role is 'anon'

  2. Security
    - Both authenticated and anon users can read their own records
    - Both authenticated and anon users can insert their own records
    - Records remain isolated by user_id
*/

DROP POLICY IF EXISTS "Users can read own lab records" ON lab_history;
DROP POLICY IF EXISTS "Users can insert own lab records" ON lab_history;

CREATE POLICY "Users can read own lab records"
  ON lab_history
  FOR SELECT
  TO authenticated, anon
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lab records"
  ON lab_history
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (auth.uid() = user_id);