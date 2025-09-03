import axios from "axios";
import "dotenv/config";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

export async function fetchMovieById(imdbID) {  
  const res = await axios.get(
    `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`
  );

  const data = res.data;
  return data;
}

export async function searchMovies(query) {
  const res = await axios.get(
    `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}&page=1`
  );
  return res;
}