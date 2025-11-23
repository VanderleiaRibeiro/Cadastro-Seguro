const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
  }
  if (userModel.findByUsername(username)) {
    return res.status(400).json({ message: "Usuário já existe." });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = { username, email, passwordHash, role: "user" };
    const saved = userModel.addUser(newUser);
    return res
      .status(201)
      .json({ message: "Cadastro realizado com sucesso.", userId: saved.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro no servidor." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ message: "Campos faltando." });
  const user = userModel.findByUsername(username);
  if (!user) return res.status(401).json({ message: "Credenciais inválidas." });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Credenciais inválidas." });
  const payload = { userId: user.id, userRole: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  return res.status(200).json({ token, role: user.role });
});

module.exports = router;
