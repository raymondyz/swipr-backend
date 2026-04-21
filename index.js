import express from "express";
import cors from "cors";
import { login, signup } from "./services/authService.js";

const app = express();

// For testing, remove for production
app.use(cors());
app.options('{*splat}', cors());


app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await login(email, password)
    return res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    });
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

app.post("/auth/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const user = await signup({ name, username, email, password })
    return res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role
    });
  }
  catch (err) {
    return res.status(401).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});