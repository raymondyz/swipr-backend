import { supabase } from "./client.js"

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

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      { user_id: userId, ...updates },
      { onConflict: "user_id" }
    )
    .select()
    .single()

  if (error) throw error
  return data
}