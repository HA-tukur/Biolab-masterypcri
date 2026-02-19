/*
  # Clean up locked simulation activities

  1. Changes
    - Delete all simulation_usage records for locked simulations (Gel Electrophoresis, Western Blot, Confocal Microscopy, etc.)
    - Only keep records for available simulations: DNA Extraction and PCR
    - This ensures the Last Activity widget only shows valid, accessible simulations

  2. Impact
    - Removes invalid activity records that users should never have been able to create
    - Prevents "Resume" buttons from appearing for locked simulations
    - Cleans up the database to match the current available simulation set

  3. Security
    - No security changes needed - this is data cleanup only
*/

-- Delete all simulation_usage records for locked simulations
-- Only keep DNA Extraction and PCR variants
DELETE FROM simulation_usage
WHERE simulation_name NOT IN ('DNA Extraction', 'PCR', 'PCR Setup');

-- Log the cleanup
DO $$
BEGIN
  RAISE NOTICE 'Cleaned up simulation_usage records for locked simulations';
END $$;
