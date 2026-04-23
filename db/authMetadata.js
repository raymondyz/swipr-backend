import { supabase } from "./client.js"


export async function verifyCode(userId, code) {
  const { data, error } = await supabase
    .from("auth_metadata")
    .select("verification_code, verification_expires")
    .eq("user_id", userId)
    .single()

  if (error) throw new Error("Verification failed")

  const { verification_code, verification_expires } = data;

  // no code stored
  if (!verification_code) {
    throw new Error("No verification code found")
  }

  // check match
  if (verification_code !== code) {
    throw new Error("Invalid code")
  }

  // check expiry
  if (new Date() > new Date(verification_expires)) {
    throw new Error("Code expired")
  }

  return true;
}

export async function setVerificationCode(userId, code, expiresInMs) {
  const expires = new Date(Date.now() + expiresInMs)

  const { data, error } = await supabase
    .from("auth_metadata")
    .upsert(
      {
        user_id: userId,
        verification_code: code,
        verification_expires: expires,
      },
      { onConflict: "user_id" } // ensures overwrite
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function clearVerificationCode(userId) {
  const { error } = await supabase
    .from("auth_metadata")
    .update({
      verification_code: null,
      verification_expires: null,
    })
    .eq("user_id", userId)

  if (error) throw error
}