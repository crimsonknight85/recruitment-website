import { supabaseAdmin } from './admin';

export async function fetchApplications() {
  const { data, error } = await supabaseAdmin
    .from('job_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
