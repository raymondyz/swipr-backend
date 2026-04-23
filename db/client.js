import 'dotenv/config'
import { createClient } from "@supabase/supabase-js"
import { Resend } from 'resend'

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const resend = new Resend(process.env.RESEND_API_KEY)
