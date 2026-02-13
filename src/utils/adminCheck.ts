import { User } from '@supabase/supabase-js';

export function isAdmin(user: User | null): boolean {
  console.log('=== ADMIN CHECK DEBUG ===');
  console.log('User email:', user?.email);
  console.log('User app_metadata:', user?.app_metadata);

  if (!user) {
    console.log('isAdmin result: false (no user)');
    return false;
  }

  if (user.app_metadata?.role === 'admin') {
    console.log('isAdmin result: true (app_metadata role is admin)');
    return true;
  }

  const adminEmailsEnv = import.meta.env.VITE_ADMIN_EMAILS || '';
  console.log('VITE_ADMIN_EMAILS env var:', adminEmailsEnv);

  const adminEmails = adminEmailsEnv
    .split(',')
    .map((email: string) => email.trim())
    .filter((email: string) => email.length > 0);

  console.log('Parsed admin emails:', adminEmails);

  const result = adminEmails.includes(user.email || '');
  console.log('isAdmin result:', result, '(email match check)');
  console.log('========================');

  return result;
}
