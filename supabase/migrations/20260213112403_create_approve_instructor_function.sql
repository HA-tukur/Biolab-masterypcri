/*
  # Create Approve Instructor Request Function

  1. New Functions
    - `approve_instructor_request(request_id UUID)`
      - Validates the request exists and is pending
      - Updates the user's auth metadata to set role='instructor'
      - Updates the instructor_requests table with approval status
      - Returns success or error message

  2. Security
    - Function runs with SECURITY DEFINER to allow auth.users updates
    - Checks that caller is an admin before allowing approval
*/

-- Create function to approve instructor requests
CREATE OR REPLACE FUNCTION approve_instructor_request(request_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  request_user_id UUID;
  request_status TEXT;
  admin_user_id UUID;
  admin_role TEXT;
  current_metadata JSONB;
  new_metadata JSONB;
BEGIN
  -- Get the current user ID
  admin_user_id := auth.uid();
  
  IF admin_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Check if caller is admin
  SELECT raw_app_meta_data->>'role' INTO admin_role
  FROM auth.users
  WHERE id = admin_user_id;

  IF admin_role != 'admin' THEN
    RETURN json_build_object('error', 'Admin access required');
  END IF;

  -- Get the instructor request
  SELECT user_id, status INTO request_user_id, request_status
  FROM instructor_requests
  WHERE id = request_id;

  IF request_user_id IS NULL THEN
    RETURN json_build_object('error', 'Request not found');
  END IF;

  IF request_status != 'pending' THEN
    RETURN json_build_object('error', 'Request has already been processed');
  END IF;

  -- Get current user metadata
  SELECT COALESCE(raw_app_meta_data, '{}'::jsonb) INTO current_metadata
  FROM auth.users
  WHERE id = request_user_id;

  -- Build new metadata with role='instructor'
  new_metadata := current_metadata || jsonb_build_object('role', 'instructor');

  -- Update the user's auth metadata
  UPDATE auth.users
  SET raw_app_meta_data = new_metadata,
      updated_at = NOW()
  WHERE id = request_user_id;

  -- Update the instructor request
  UPDATE instructor_requests
  SET status = 'approved',
      decision_by_admin_id = admin_user_id,
      decision_at = NOW()
  WHERE id = request_id;

  -- Also update the profiles table to set role
  UPDATE profiles
  SET role = 'instructor',
      updated_at = NOW()
  WHERE id = request_user_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Request approved successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;

-- Create similar function for rejecting requests
CREATE OR REPLACE FUNCTION reject_instructor_request(request_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  request_user_id UUID;
  request_status TEXT;
  admin_user_id UUID;
  admin_role TEXT;
BEGIN
  -- Get the current user ID
  admin_user_id := auth.uid();
  
  IF admin_user_id IS NULL THEN
    RETURN json_build_object('error', 'Not authenticated');
  END IF;

  -- Check if caller is admin
  SELECT raw_app_meta_data->>'role' INTO admin_role
  FROM auth.users
  WHERE id = admin_user_id;

  IF admin_role != 'admin' THEN
    RETURN json_build_object('error', 'Admin access required');
  END IF;

  -- Get the instructor request
  SELECT user_id, status INTO request_user_id, request_status
  FROM instructor_requests
  WHERE id = request_id;

  IF request_user_id IS NULL THEN
    RETURN json_build_object('error', 'Request not found');
  END IF;

  IF request_status != 'pending' THEN
    RETURN json_build_object('error', 'Request has already been processed');
  END IF;

  -- Update the instructor request
  UPDATE instructor_requests
  SET status = 'rejected',
      decision_by_admin_id = admin_user_id,
      decision_at = NOW()
  WHERE id = request_id;

  RETURN json_build_object(
    'success', true,
    'message', 'Request rejected successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM);
END;
$$;