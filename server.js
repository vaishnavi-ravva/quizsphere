const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/quizsphere")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const SECRET = "quizsphere_secret";

/* REGISTER */
app.post("/api/register", async (req, res) => {
  try {
    const { name, dob, password, bankAccount, ifsc } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      dob,
      password: hashedPassword,
      bankAccount,
      ifsc
    });

    await user.save();
    res.json({ message: "Registration successful" });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
});

/* LOGIN */
app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) return res.status(401).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid password" });

  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
