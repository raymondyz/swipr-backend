import bcrypt from "bcrypt"
import { activateUser, createUser, getUserByEmail, updateUser } from "../db/users.js";
import { setVerificationCode, verifyCode, clearVerificationCode } from "../db/authMetadata.js";
import { sendVerificationEmail } from "./emailService.js";

export async function signup({ name, username, email, password }) {
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    return await createUser({
      name,
      username,
      email,
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

  try {
    user = await getUserByEmail(email);
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

export async function createAndSendCode(email) {
  const code = generateCode()
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("User not found")
  }

  await setVerificationCode(user.id, code, 10 * 60 * 1000)
  await sendVerificationEmail(email, code)
}

export async function verifyCodeAndActivate(email, code) {
  const user = await getUserByEmail(email)
  if (!user) throw new Error()

  await verifyCode(user.id, code)
  await clearVerificationCode(user.id)
  await activateUser(user.id)
}