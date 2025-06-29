import {StreamChat} from 'stream-chat';
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.log("STREAM_API_KEY and STREAM_API_SECRET must be set in the environment variables.");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;

    } catch (error) {
        console.log("Error upserting Stream user:", error);
    }
}

// TODO: do it later 
export const generateStreamToken = (userId) => {
    try {
        //ensure userid is a string
        const userIdString = String(userId);
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.log("Error generating Stream token:", error);
    }
}
