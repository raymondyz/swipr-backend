import { sendVerificationEmail } from "./services/emailService.js";
import { createAndSendCode, signup, verifyCodeAndActivate } from "./services/authService.js";
import { getProfile } from "./db/user_profiles.js";
import { getUserByEmail } from "./db/users.js";



// console.log(await getUserByEmail("ryz@g.ucla.edu"))
// console.log(await getProfile("1cfca496-8341-4d18-833b-807f3d66ba1c"))

// signup({ name: "raymond", username: "ryz", email: "ryz@ucla.edu", password: "raymond123"})