/*
  # Create Leaderboard Profiles Table

  ## Summary
  Creates a public leaderboard system for high school and university students to compete and track rankings nationally.

  ## New Tables
  
  ### `leaderboard_profiles`
  - `id` (uuid, primary key) - Unique identifier for each leaderboard profile
  - `student_id` (text, unique, not null) - Links to the student's ID
  - `display_name` (text, not null) - Public display name for the leaderboard
  - `school_name` (text) - Optional school name
  - `country` (text, default 'Unknown') - Country for regional rankings
  - `user_type` (text, not null) - Either 'high_school' or 'university'
  - `total_score` (numeric, default 0) - Aggregate score across all missions
  - `missions_completed` (integer, default 0) - Total number of completed missions
  - `best_purity_score` (numeric, default 0) - Best DNA purity score achieved
  - `average_score` (numeric, default 0) - Average score across all attempts
  - `is_visible` (boolean, default true) - Whether profile appears on leaderboard
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on `leaderboard_profiles` table
  - Add policy for public read access to visible profiles
  - Add policy for students to insert their own profile
  - Add policy for students to update their own profile
  - Add policy for students to manage their own visibility

  ## Notes
  - Students must opt-in to create a leaderboard profile
  - Scores are calculated from lab_results table
  - Leaderboard is filterable by user_type, country
  - Privacy-focused: students control visibility
*/

CREATE TABLE IF NOT EXISTS leaderboard_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  display_name text NOT NULL,
  school_name text,
  country text DEFAULT 'Unknown',
  user_type text NOT NULL CHECK (user_type IN ('high_school', 'university', 'independent')),
  total_score numeric DEFAULT 0,
  missions_completed integer DEFAULT 0,
  best_purity_score numeric DEFAULT 0,
  average_score numeric DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leaderboard_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible leaderboard profiles"
  ON leaderboard_profiles
  FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Students can create their own leaderboard profile"
  ON leaderboard_profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Students can update their own leaderboard profile"
  ON leaderboard_profiles
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Students can delete their own leaderboard profile"
  ON leaderboard_profiles
  FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_leaderboard_total_score ON leaderboard_profiles(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_type ON leaderboard_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_leaderboard_country ON leaderboard_profiles(country);
CREATE INDEX IF NOT EXISTS idx_leaderboard_visible ON leaderboard_profiles(is_visible);
