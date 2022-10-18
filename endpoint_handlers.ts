import {Request, Response} from "express";
import {getAccessToken} from "./sumsub";

export async function handleAccessTokenEndpoint(
    request: Request, response: Response
) {
    console.log("Handling access token endpoint...");
    try {
        const userID = request.query.userID;

        if (userID === undefined || typeof userID !== "string") {
            throw Error("User ID is missing or it's of the wrong type.");
        }

        const accessToken = await getAccessToken(userID);
        response.status(200).json({token: accessToken});
    } catch (error) {
        console.log("An error occurred.", error);
        let errorMessage;
        if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "An error occurred";
        }
        response.status(500).json({error: "An error occurred."});
    }
}