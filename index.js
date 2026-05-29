import express from "express";
import cors from "cors";
import { getAllUserProfiles, getProfile, updateProfile } from "./db/user_profiles.js";
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

app.post("/user/getAllUserProfiles", async (req, res) => {
    try {
        const data = await getAllUserProfiles();
        return res.json(data);
    } catch (error) {
        res.status(500).json({
            error: err.message || "Internal server error",
        });
    }
})

app.post("/profile/get", async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const profile = await getProfile(userId);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/profile/update", async (req, res) => {
  const { userId, updates } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "updates object is required" });
    }

    const allowedFields = ["swipe_availability", "notes", "location_preferences", "availability"];
    const safeUpdates = {};

    for (const field of allowedFields) {
      if (field in updates) {
        safeUpdates[field] = updates[field];
      }
    }

    // Validation
    const VALID_SWIPE = ["offer_swipes", "self_swipes", "need_swipes"];
    if (safeUpdates.swipe_availability && !VALID_SWIPE.includes(safeUpdates.swipe_availability)) {
      return res.status(400).json({ error: "Invalid swipe_availability" });
    }
    if (safeUpdates.notes !== undefined && (typeof safeUpdates.notes !== "string" || safeUpdates.notes.length > 1000)) {
      return res.status(400).json({ error: "Invalid notes" });
    }
    if (safeUpdates.location_preferences !== undefined) {
      const lp = safeUpdates.location_preferences;
      const valid =
        lp !== null &&
        typeof lp === "object" &&
        !Array.isArray(lp) &&
        Object.values(lp).every(
          (rating) => typeof rating === "number" && rating >= 0 && rating <= 5
        );
      if (!valid) {
        return res.status(400).json({ error: "location_preferences must be an object of location: rating (0-5)" });
      }
    }

    safeUpdates.updated_at = new Date();

    const profile = await updateProfile(userId, safeUpdates);
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ error: err.message });
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

app.post("/messages/get", async (req, res) => {
  const { userFrom, userTo } = req.body;

  try {
    if (!userFrom) {
      return res.status(400).json({error: "userFrom is required",});
    }

    if (!userTo) {
      return res.status(400).json({error: "userTo is required",});
    }

    const messages = await getMessages(userFrom, userTo);

    return res.json(messages);

  } catch (err) {
      return res.status(500).json({error: err.message,});
  }
});

app.post("/messages/send", async (req, res) => {
  const { senderId, receiverId, content } = req.body;

  try {
    if (!senderId) {
      return res.status(400).json({error: "senderId is required",});
    }

    if (!receiverId) {
      return res.status(400).json({error: "receiverId is required",});
    }

    if (!content) {
      return res.status(400).json({error: "content is required",});
    }

    const message = await sendMessage(senderId, receiverId, content);

    return res.json(message);

  } catch (err) {
      return res.status(500).json({error: err.message,});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});