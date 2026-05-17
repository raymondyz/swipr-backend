import { sendVerificationEmail } from "./services/emailService.js";
import { createAndSendCode, signup, verifyCodeAndActivate } from "./services/authService.js";
import { getAllUserProfiles } from "./db/users.js";

// createAndSendCode("ryz@ucla.edu")
// verifyCodeAndActivate("ryz@ucla.edu", "390996")
console.log(JSON.stringify(await getAllUserProfiles()));
import { standardizeEmail } from "./services/authService.js";


// createAndSendCode("ryz@ucla.edu")
console.log(standardizeEmail("RYz@g.ucla.edu"));

// signup({ name: "raymond", username: "ryz", email: "ryz@ucla.edu", password: "raymond123"})