import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";


//All error methods
const validateObjectId = (noteId: string) => {
    if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, 'Invalid Note Id');
    }
}

const validateTitle = (title?: string) => {
    if (!title) {
        throw createHttpError(400, "Note must have a title");
    }
}

// Get all notes
export const getNotes: RequestHandler = async (req, res, next) => {
    try {
        const notes = await NoteModel.find().exec();
        res.status(200).json(notes)
    } catch (error) {
       next(error);
    }
}

//get a specific note
export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId
    try {
        validateObjectId(noteId);

        const note = await NoteModel.findById(noteId).exec();
        if(!note){
           throw createHttpError(404, 'Note not found');
        }
        res.status(200).json(note);
    } catch (error) {
            next(error);   
    } 
} 

//Create a note
interface createNoteBody{
    title?: string,
    text?: string,
}
export const createNote: RequestHandler<unknown, unknown, createNoteBody, unknown > = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;
    try {
        validateTitle(title);
        const newNote = NoteModel.create({
            title: title,
            text: text,
        });
        res.status(201).json(newNote);
    } catch (error) {
        next(error); 
    }
}

//Updating a note
interface UpdateNoteParams{
    noteId: string,
}
interface UpdateNoteBody{
    title?: string,
    text?: string,
}
// Params: The parameters from the URL (e.g., /notes/:id, where id is a parameter).
// ResBody: The type of the data you will send back in the response body.
// ReqBody: The type of the data you expect in the request body (req.body), in this case, the createNoteBody.
// ReqQuery: : The type of the query parameters in the request URL (e.g., /notes?sort=asc).

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
        validateObjectId(noteId);
        if (!newTitle) {
            throw createHttpError(400, "Note must have a title");
        }
        const note = await NoteModel.findById(noteId).exec();
        
        if(!note){
            throw createHttpError(404, 'Note not found');
        }
        note.title = newTitle;
        note.text = newText;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);
    } catch (error) {
        next(error); 
    } 
}

// Delete a note
export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    try {
        validateObjectId(noteId);

        const note = await NoteModel.findById(noteId).exec();

        if(!note){
            throw createHttpError(404, 'Note not found');
        }
        await NoteModel.deleteOne({ _id: noteId });
        res.sendStatus(204);
    }
    catch (error) {
        next(error);
    }
}