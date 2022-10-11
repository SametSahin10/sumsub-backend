"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const endpoint_handlers_1 = require("./endpoint_handlers");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.get("/", (request, response) => {
    response.send("Express + TypeScript Server");
});
app.get("/accessToken", endpoint_handlers_1.handleAccessTokenEndpoint);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
