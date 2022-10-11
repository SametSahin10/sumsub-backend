import express, {Request, Response} from "express";
import dotenv from "dotenv";
import {handleAccessTokenEndpoint} from "./endpoint_handlers";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/", (request: Request, response: Response) => {
    response.send("Express + TypeScript Server");
});

app.get("/accessToken", handleAccessTokenEndpoint);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});