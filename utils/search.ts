import { SEARCH_URL } from "./const";
import { Token } from "./entities";
import { getStoredToken, getToken, storeToken } from "./token";
import commonPrefix from 'common-prefix';

export async function nameSearch(query: string): Promise<any> {
    console.log("Fetching token...");
    let token: Token = await getStoredToken();
    if (token.access_token === "") {
        console.log("No token found in KV, fetching a new one...");

        token = await getToken();
        console.log("New token fetched:", token);

        await storeToken(token);
        console.log("New token stored in KV");
    } else {
        console.log("Token found in KV");
    }

    console.log("Using token:", token);

    const body = `search "${query}"; fields name,slug;`;
    const headers = {
        "Client-ID": process.env.CLIENT_ID || "",
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
    };

    const response = await fetch(SEARCH_URL, {
        method: "POST",
        headers: headers,
        body: body,
    });

    if (!response.ok) {
        console.error("Error fetching data from IGDB:", response.statusText);
        return "Failed to fetch data from IGDB";
    }

    const data = await response.json();
    console.log("Data received from IGDB:", data);
    if (!data || data.length === 0) {
        console.error("No data found for the given query");
        return "No data found for the given query";
    }

    const names = getNames(data);
    console.log("Names extracted from data:", names);

    const commonPrefixResult = commonPrefix(names);
    console.log("Common prefix:", commonPrefixResult);

    return commonPrefixResult;
}

function getNames(data: any): String[] {
    const results: String[] = [];

    for (const item of data) {
        if (item.name) {
            results.push(item.name);
        }
    }
    return results;
}