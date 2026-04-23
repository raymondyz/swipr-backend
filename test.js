import { sendVerificationEmail } from "./services/emailService.js";
import { createAndSendCode, signup, verifyCodeAndActivate } from "./services/authService.js";


// createAndSendCode("ryz@ucla.edu")
verifyCodeAndActivate("ryz@ucla.edu", "390996")

// signup({ name: "raymond", username: "ryz", email: "ryz@ucla.edu", password: "raymond123"})