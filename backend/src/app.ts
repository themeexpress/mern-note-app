import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import notesRoutes from "./routes/notes";

const app = express();

app.use(express.json());
//get notes
app.use("/api/notes", notesRoutes)

//unknown endpoint
app.use((req, res, next)=>{
    next(Error("Endpoint not found"));
});

//Error middle ware
app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.log(error)
    let errorMessage = "An unknown error occureed"
    if (error instanceof Error) errorMessage  = error.message
    res.status(500).json({ error: errorMessage })
});

export default app;