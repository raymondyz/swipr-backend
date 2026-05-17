import bcrypt from "bcrypt"
import { activateUser, createUser, getUserByEmail, updateUser } from "../db/users.js";
import { setVerificationCode, verifyCode, clearVerificationCode } from "../db/authMetadata.js";
import { sendResetEmail, sendVerificationEmail } from "./emailService.js";

export async function signup({ name, username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);
  const standardEmail = standardizeEmail(email)
  console.log(standardEmail)

  try {
    return await createUser({
      name,
      username,
      email: standardEmail,
      password_hash: passwordHash,
      role: "user",
    });
  } catch (err) {
    // Postgres unique constraint error
    if (err.code === "23505") {
      throw new Error("Username or email already exists");
    }

    throw new Error("Signup failed");
  }
}


export async function login(email, password) {
  let user;
  const standardEmail = standardizeEmail(email)

  try {
    user = await getUserByEmail(standardEmail);
  } catch (err) {
    throw new Error("Invalid credentials");
  }

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  return user;
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function standardizeEmail(email) {
  email = email.trim().toLowerCase()
  
  if (email.endsWith("@g.ucla.edu"))
    return email.replace("@g.ucla.edu", "@ucla.edu")

  return email
}

export async function createAndSendCode(email) {
  const code = generateCode()
  const standardEmail = standardizeEmail(email)
  const user = await getUserByEmail(standardEmail)
  if (!user) {
    throw new Error("User not found")
  }

  await setVerificationCode(user.id, code, 10 * 60 * 1000)
  await sendVerificationEmail(standardEmail, code)
}

export async function createAndSendResetCode(email) {
  const code = generateCode()
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("User not found")
  }

  await setVerificationCode(user.id, code, 10 * 60 * 1000)
  await sendResetEmail(email, code)
}

export async function verifyCodeAndActivate(email, code) {
  const standardEmail = standardizeEmail(email)
  const user = await getUserByEmail(standardEmail)
  if (!user) throw new Error()

  await verifyCode(user.id, code)
  await clearVerificationCode(user.id)
  await activateUser(user.id)
}