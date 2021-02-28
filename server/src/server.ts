import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import { PORT, mongoURI } from "./config/config";
import { HttpError } from "./models/HttpError";
import authRoutes from "./routes/auth/authRoutes";
import dashboardRoutes from "./routes/dashboard/dashboardRoutes";

const app = express();

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use("/api/auth/", authRoutes);
app.use("/api/dashboard/", dashboardRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError("Route not Found", 404);
  throw error;
});

//Run App
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) return next(error);
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(PORT);
    console.log("db and server are running");
  })
  .catch(err => {
    throw new HttpError("An unknown error occurred!", 500);
  });
