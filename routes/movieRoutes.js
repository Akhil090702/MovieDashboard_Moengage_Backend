import express from "express";
import { search, getMovieById, getStats} from "../controllers/movieController.js";

const router = express.Router();

router.get("/search", search);
router.get("/id/:id", getMovieById);
router.get("/stats", getStats); 

export default router;
