'use server';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = cookies(); // ✅ correct: this function is sync and returns a cookie store
  return createServerComponentClient({ cookies: () => cookieStore });
}
