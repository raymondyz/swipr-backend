import express from "express";
import { login, signup } from "./services/authService";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

app.post("/login", (req, res) => {
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

app.post("/signup", (req, res) => {
  const { name, username, email, password } = req.body;

  const user = {
    name: name,
    username: username,
    email: email,
    password: password,
    role: "user",
  }

  try {
    const user = await signup(user)
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