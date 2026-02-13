import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email: string | null;
  full_name: string;
  university: string;
  program_department: string;
  year_of_study: string | null;
  referral_source: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  full_name?: string;
  university?: string;
  program_department?: string;
  year_of_study?: string | null;
  referral_source?: string | null;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { data, error };
}

export async function updateProfile(userId: string, updates: ProfileUpdateData) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle();

  return { data, error };
}
