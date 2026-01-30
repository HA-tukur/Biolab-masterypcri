import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const PASSING_THRESHOLD = 85;

export async function upsertCertificate(
  studentId: string,
  mission: string,
  score: number
): Promise<void> {
  try {
    const normalizedScore = Math.min((score / 2) * 100, 100);
    const isPassing = normalizedScore >= PASSING_THRESHOLD;

    const { data: existingCert } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', studentId)
      .eq('mission', mission)
      .maybeSingle();

    if (existingCert) {
      const newAttemptCount = existingCert.attempt_count + 1;
      const newSuccessCount = isPassing
        ? existingCert.success_count + 1
        : existingCert.success_count;
      const isNewBestScore = normalizedScore > existingCert.best_score;

      await supabase
        .from('certificates')
        .update({
          best_score: isNewBestScore ? normalizedScore : existingCert.best_score,
          attempt_count: newAttemptCount,
          success_count: newSuccessCount,
          date_updated: isNewBestScore ? new Date().toISOString() : existingCert.date_updated
        })
        .eq('id', existingCert.id);
    } else if (isPassing) {
      await supabase
        .from('certificates')
        .insert({
          student_id: studentId,
          mission: mission,
          best_score: normalizedScore,
          attempt_count: 1,
          success_count: 1,
          date_earned: new Date().toISOString(),
          date_updated: new Date().toISOString()
        });
    }
  } catch (error) {
    console.error('Failed to upsert certificate:', error);
  }
}
