import axios from "axios";
import Movie from "../models/Movie.js";
import SearchCache from "../models/SearchCache.js";
import "dotenv/config";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = process.env.OMDB_BASE;

export const search = async (req, res) => {
  const query = req.query.q;
  const page = req.query.page;
  try {
    const cached = await SearchCache.findOne({
      q: query,
      page: parseInt(page) || 1,
    });
    if (cached) {
      return res.json({
        Search: cached.results,
        totalResults: cached.results.length,
        Response: "True",
        cached: true,
      });
    }

    const results = await axios.get(
      `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${query}&page=${page}`
    );
    if (results.data.Response === "False") {
      return res.status(404).json({ error: results.data.Error });
    }

    console.log("Results are: ", results);
    try {
      await SearchCache.create({
        q: query,
        results: results.data.Search,
        page: parseInt(page) || 1,
      });
    } catch (err) {
      if (err.code === 11000) {
        console.log("Cache already exists, skipping create.");
      } else {
        throw err;
      }
    }
    res.json(results.data);
  } catch (err) {
    console.error("Error searching movies:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMovieById = async (req, res) => {
  const id = req.params.id;

  try {
    const cached = await Movie.findOne({ imdbID: id });
    if (cached) return res.json(cached.raw);

    const { data } = await axios.get(
      `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    );
    if (data.Response === "False")
      return res.status(404).json({ error: data.Error });

    try {
      await Movie.create({
        imdbID: data.imdbID,
        raw: data,
      });
    } catch (err) {
      if (err.code === 11000) {
        console.log("Cache already exists, skipping create.");
      } else {
        throw err;
      }
    }
    res.json(newMovie.raw);
  } catch (err) {
    console.error("Error fetching movie by ID:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
