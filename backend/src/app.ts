import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import notesRoutes from "./routes/notes";
import morgan from 'morgan';
import createHttpError, { isHttpError } from "http-errors";

const app = express();
app.use(morgan('dev'))

app.use(express.json());
//get notes
app.use("/api/notes", notesRoutes)

//unknown endpoint
app.use((req, res, next)=>{
    next(createHttpError(404, "Endpoint not found"));
});

//Error middle ware
app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.log(error)
    let errorMessage = "An unknown error occureed";
    let statuscode = 500;
    if (isHttpError(error)){
        statuscode = error.status;
        errorMessage = error.message;
    } 
    res.status(statuscode).json({ error: errorMessage })
});

export default app;