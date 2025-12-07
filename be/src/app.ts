import express from "express";
import cors from "cors";
import path from "path";

import authRouter from "./controllers/authController";
import vacationsRouter from "./controllers/vacationsController";
import reportsRouter from "./controllers/reportsController";

const app = express();

app.use(cors({origin: [    
    "http://localhost:5173"
]}))

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "..", "uploads")));

app.use("/auth", authRouter);
app.use("/vacations", vacationsRouter);
app.use("/reports", reportsRouter);

app.listen(3030, () => console.log(`Express server started.\nhttp://localhost:3030`));
