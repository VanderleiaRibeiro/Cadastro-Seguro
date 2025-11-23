const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/auth");
const fileRoutes = require("./routes/file");

app.use("/auth", authRoutes);
app.use("/file", fileRoutes);

app.use("/", express.static(path.join(__dirname, "..", "frontend")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server rodando na porta", PORT));
