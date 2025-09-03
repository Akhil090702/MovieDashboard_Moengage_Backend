import mongoose from "mongoose";

const searchCacheSchema = new mongoose.Schema({
  q: { type: String, unique: true, index: true },
  results: [mongoose.Schema.Types.Mixed], 
  cachedAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 },
  page: { type: Number, required: true },
});

export default mongoose.model("SearchCache", searchCacheSchema);
