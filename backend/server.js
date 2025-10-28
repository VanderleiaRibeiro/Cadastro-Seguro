const express = require("express");
const cors = require("cors");
const path = require("path");
const userModel = require("./models/userModel");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios",
      });
    }

    const existingUser = userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username já está em uso",
      });
    }

    const newUser = await userModel.addUser({
      username,
      email,
      password,
    });

    const { passwordHash, ...userResponse } = newUser;

    res.status(201).json({
      success: true,
      message: "Usuário cadastrado com sucesso",
      user: userResponse,
    });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "Servidor rodando",
    timestamp: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});
