import express from "express";
import { search, getMovieById } from "../controllers/movieController.js";

const router = express.Router();

router.get("/search", search);
router.get("/id", getMovieById);    

export default router;
