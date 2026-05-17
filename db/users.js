import { supabase } from "./client.js"

export function standardizeEmail(email) {
  email = email.trim().toLowerCase()
  
  if (email.endsWith("@g.ucla.edu"))
    return email.replace("@g.ucla.edu", "@ucla.edu")

  return email
}

export async function createUser(user) {
  const standardizedUser = {
    ...user,
    email: standardizeEmail(user.email),
  }
  const { data, error } = await supabase
    .from("users")
    .insert([standardizedUser])
    .select()

  if (error) throw error
  return data[0]
}

export async function getUserByEmail(email) {
  const standardEmail = standardizeEmail(email)
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", standardEmail)
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

export async function getAllUserProfiles() {
    const {data, error} = await supabase
        .from("user_profiles")
        .select(`
        user_id,
        swipe_availability,
        notes,
        location_preferences,
        users (
            name,
            username
        )
    `);

    if (error) {
        console.error("Error fetching user profiles:", error);
        return { data: null, error };
    }

    return { data, error: null };
}