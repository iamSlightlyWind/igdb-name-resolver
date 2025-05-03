import process from "process";
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