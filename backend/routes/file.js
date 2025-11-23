const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function verificarToken(req, res, next) {
  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ message: "Token ausente." });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Formato de token inválido." });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.userRole;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido." });
  }
}

function verificarAdmin(req, res, next) {
  if (req.userRole !== "admin")
    return res.status(403).json({ message: "Acesso negado. Admins apenas." });
  next();
}

const uploadFolder = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg")
    cb(null, true);
  else cb(new Error("Tipo de arquivo inválido."));
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
}).array("meusArquivos", 10);

router.post("/upload", verificarToken, (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    // success
    console.log("Upload feito pelo userId:", req.userId);
    return res
      .status(201)
      .json({
        message: "Arquivos enviados com sucesso.",
        files: req.files.map((f) => f.filename),
      });
  });
});

router.delete("/:filename", verificarToken, verificarAdmin, (req, res) => {
  const filename = req.params.filename;
  const safePath = path.join(uploadFolder, path.basename(filename));
  fs.unlink(safePath, (err) => {
    if (err)
      return res.status(404).json({ message: "Arquivo não encontrado." });
    return res.status(200).json({ message: "Arquivo deletado." });
  });
});

module.exports = router;
