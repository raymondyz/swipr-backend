import express from "express";
import cors from "cors";
import { createAndSendCode, createAndSendResetCode, login, signup, verifyCodeAndActivate } from "./services/authService.js";
import { getUserByEmail } from "./db/users.js";

const app = express();

// For testing, remove for production
app.use(cors());
app.options('{*splat}', cors());


app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/user", async (req, res) => {
  const { email } = req.body

  try {
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password_hash, ...safeUser } = user;
    return res.json(safeUser);
  }
  catch (err) {
    res.status(500).json({
      error: err.message || "Internal server error",
    });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await login(email, password)
    const { password_hash, ...safeUser } = user;
    return res.json(safeUser);
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

app.post("/auth/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const user = await signup({ name, username, email, password })
    const { password_hash, ...safeUser } = user;
    return res.json(safeUser);
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

app.post("/auth/send-code", async (req, res) => {
  const { email } = req.body;

  try {
    await createAndSendCode(email)

    res.json({ success: true })
  }
  catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/auth/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    await verifyCodeAndActivate(email, code)

    res.json({ success: true })
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

app.post("/auth/send-reset-code", async (req, res) => {
    const {email} = res.body;

    const user = await getUserByEmail(email)
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    try {
        await createAndSendResetCode(email)

        res.json({ success: true })
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});