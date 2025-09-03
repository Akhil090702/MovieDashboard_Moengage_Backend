import axios from "axios";
import "dotenv/config";

const OMDB_API_KEY = process.env.OMDB_API_KEY;
const OMDB_BASE = process.env.OMDB_BASE;

export async function fetchMovieById(imdbID) {  
  const res = await axios.get(
    `${OMDB_BASE}?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
  );

  const data = res.data;
  return data;
}

export async function searchMovies(query) {
  const res = await axios.get(
    `${OMDB_BASE}?apikey=${OMDB_API_KEY}&s=${query}&page=1`
  );
  return res;
}