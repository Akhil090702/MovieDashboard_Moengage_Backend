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
  console.log("Id received in controller is:", id);

  try {
    // Check cache first
    const cached = await Movie.findOne({ imdbID: id });
    if (cached) return res.json(cached.raw);

    // Fetch from OMDB
    const { data } = await axios.get(
      `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${id}&plot=full`
    );

    if (data.Response === "False") {
      return res.status(404).json({ error: data.Error });
    }

    // Save to DB
    const newMovie = await Movie.create({
      imdbID: data.imdbID,
      raw: data,
    });

    res.json(newMovie.raw);
  } catch (err) {
    console.error("Error fetching movie by ID:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const getStats = async (req, res) => {
  const pageLimit = 3; // how many OMDB pages to fetch
  try {
    const allMovies = [];

    for (let page = 1; page <= pageLimit; page++) {
      const { data } = await axios.get(
        `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=movie&type=movie&page=${page}`
      );
      if (data.Search) allMovies.push(...data.Search);
    }

    // Fetch details
    const detailedMovies = await Promise.all(
      allMovies.map((m) =>
        axios
          .get(`${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${m.imdbID}&plot=short`)
          .then((res) => res.data)
      )
    );

    // Genre distribution
    const genreCount = {};
    detailedMovies.forEach(({ Genre }) =>
      Genre?.split(",").forEach((g) => {
        const genre = g.trim();
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      })
    );

    // Average rating
    const ratings = detailedMovies
      .map((m) => parseFloat(m.imdbRating))
      .filter(Boolean);
    const avgRating = ratings.length
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : 0;

    // Avg runtime by year
    const runtimeByYear = {};
    detailedMovies.forEach(({ Year, Runtime }) => {
      const runtime = parseInt(Runtime);
      if (Year && runtime) {
        runtimeByYear[Year] = runtimeByYear[Year] || [];
        runtimeByYear[Year].push(runtime);
      }
    });
    const runtimeData = Object.entries(runtimeByYear).map(([year, runtimes]) => ({
      year,
      avg: (
        runtimes.reduce((a, b) => a + b, 0) / runtimes.length
      ).toFixed(2),
    }));

    res.json({ genreCount, avgRating, runtimeData });
  } catch (err) {
    console.error("Error generating stats:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
