import { User } from '@supabase/supabase-js';

export function isAdmin(user: User | null): boolean {
  if (!user) return false;

  if (user.app_metadata?.role === 'admin') {
    return true;
  }

  const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS || '';
  const adminEmails = adminEmailsEnv
    .split(',')
    .map((email: string) => email.trim())
    .filter((email: string) => email.length > 0);

  return adminEmails.includes(user.email || '');
}
