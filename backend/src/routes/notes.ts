import express from "express";
import * as NoteController from "../controllers/notes"

const router = express.Router();

router.get("/", NoteController.getNotes);

router.get("/:noteId", NoteController.getNote);

router.post("/", NoteController.createNote);

router.patch("/:noteId", NoteController.updateNote);

router.delete("/:noteId", NoteController.deleteNote);

export default router;