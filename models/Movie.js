import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  imdbID: { type: String, required: true, unique: true, index: true },
  title: String,
  year: String,
  genre: String,
  director: String,
  actors: String,
  plot: String,
  poster: String,
  raw: mongoose.Schema.Types.Mixed, 
  cachedAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 } // 24h TTL
});

export default mongoose.model("Movie", movieSchema);
