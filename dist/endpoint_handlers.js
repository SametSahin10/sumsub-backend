"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAccessTokenEndpoint = void 0;
const sumsub_1 = require("./sumsub");
function handleAccessTokenEndpoint(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Handling access token endpoint...");
        try {
            const userID = request.query.userID;
            if (userID === undefined || typeof userID !== "string") {
                throw Error("User ID is missing or it's of the wrong type.");
            }
            const accessToken = yield (0, sumsub_1.getAccessToken)(userID);
            response.status(200).json({ token: accessToken });
        }
        catch (error) {
            console.log("An error occurred.", error);
            let errorMessage;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else {
                errorMessage = "An error occurred";
            }
            response.status(500).json({ error: "An error occurred." });
        }
    });
}
exports.handleAccessTokenEndpoint = handleAccessTokenEndpoint;
