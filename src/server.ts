import express from "express";
import cors from "cors";
import router from "./routes";
import { verifyToken } from "./models/auth";

const app = express();
const PORT = 3000;

// === Middleware ===
app.use(
  cors({
    origin: "http://localhost:5173", // ganti dengan alamat frontend-mu
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// === Routes utama ===
app.use("/", router);

// === Jalankan server ===
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
