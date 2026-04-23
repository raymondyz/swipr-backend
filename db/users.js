import { supabase } from "./client.js"

export async function createUser(user) {
  const { data, error } = await supabase
    .from("users")
    .insert([user])
    .select()

  if (error) throw error
  return data[0]
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (error) throw error
  return data
}

export async function updateUser(userId, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export function activateUser(userId) {
  return updateUser(userId, { is_verified: true })
}