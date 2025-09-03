import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";

dotenv.config();

const App = express();
App.use(cors());
App.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
App.use("/movies", movieRoutes);

// Root route (for testing on Vercel)
App.get("/", (req, res) => {
  res.send("🎬 Movie API is running on Vercel 🚀");
});

export default App;
