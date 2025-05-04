import process from "process";
import { kv } from "@vercel/kv";
import { TOKEN_URL } from "./const";
import { Token } from "./entities";

export async function getToken(): Promise<Token> {
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

export async function storeToken(token: Token): Promise<void> {
    const tokenJson = JSON.stringify(token);
    const expires_in = token.expires_in * 1000;

    await kv.set("token", tokenJson, { ex: expires_in });
}

export async function getStoredToken(): Promise<Token> {
    const storedToken = await kv.get("token");
    if (!storedToken) {
        return new Token("", 0);
    }

    const token = Token.fromKV(storedToken);
    return token;
}