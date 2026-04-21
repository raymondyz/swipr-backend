import { supabase } from "./client.js";

export async function createUser(user) {
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select();

  if (error) throw error;
  return data[0];
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) throw error;
  return data;
}