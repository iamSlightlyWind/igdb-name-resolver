import process from "process";
import { kv } from "@vercel/kv";
import { TOKEN_URL } from "./const";
import { Token } from "./entities";

async function getToken(): Promise<Token> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!clientId) {
        throw new Error("CLIENT_ID is not defined");
    }

    if (!clientSecret) {
        throw new Error("CLIENT_SECRET is not defined");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
    });

    const response = await fetch(`${TOKEN_URL}?${params}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch token");
    }

    const data = await response.json();
    if (!data.access_token) {
        throw new Error("No access token in response");
    }

    const token: Token = Token.fromJson(JSON.stringify(data));
    return token;
}

async function storeToken(token: Token): Promise<void> {
    const tokenJson = JSON.stringify(token);
    const expires_in = token.expires_in * 1000;

    await kv.set("token", tokenJson, { ex: expires_in });
}

async function getStoredToken(): Promise<Token> {
    const tokenValue = await kv.get("token");
    if (!tokenValue) {
        return new Token("", 0);
    }
    const tokenJson = tokenValue as string;
    const token = Token.fromJson(tokenJson);
    return token;
}

export async function nameSearch(query: string): Promise<any> {
    let token: Token = await getStoredToken();
    if (token.access_token === "") {
        console.log("No token found in KV, fetching a new one...");

        token = await getToken();
        console.log("New token fetched:", token);

        await storeToken(token);
        console.log("New token stored in KV");
    }

    console.log("Using token:", token);
}