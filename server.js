import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/movies", movieRoutes);
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;