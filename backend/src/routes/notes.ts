import express from "express";
import * as NoteController from "../controllers/notes"

const router = express.Router();

router.get("/", NoteController.getNotes);

export default router;