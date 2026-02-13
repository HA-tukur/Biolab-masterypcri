/*
  # Add admin policies for instructor_requests table

  1. Changes
    - Add policy for users with admin role in app_metadata to SELECT all requests
    - Add policy for users with admin role in app_metadata to UPDATE all requests

  2. Security
    - Only users with app_metadata.role = 'admin' can view and update all requests
    - Regular users can still only view their own requests

  3. Important Notes
    - This allows the admin dashboard to work without relying on edge functions
    - Admins are identified by app_metadata.role field set via Supabase dashboard
*/

-- Policy for admins to view all requests
CREATE POLICY "Admins can view all requests"
  ON instructor_requests FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'authenticated'
    AND (auth.jwt()->'app_metadata'->>'role')::text = 'admin'
  );

-- Policy for admins to update all requests
CREATE POLICY "Admins can update all requests"
  ON instructor_requests FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt()->>'role')::text = 'authenticated'
    AND (auth.jwt()->'app_metadata'->>'role')::text = 'admin'
  )
  WITH CHECK (
    (auth.jwt()->>'role')::text = 'authenticated'
    AND (auth.jwt()->'app_metadata'->>'role')::text = 'admin'
  );
