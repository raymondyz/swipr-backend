import bcrypt from "bcrypt"
import { createUser, getUserByEmail } from "../db/users.js";

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