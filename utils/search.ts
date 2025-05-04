import { SEARCH_URL } from "./const";
import { Token } from "./entities";
import { search } from "./fuzzy";
import { getStoredToken, getToken, storeToken } from "./token";

export async function nameSearch(query: string): Promise<any> {
    let token: Token = await getStoredToken();
    if (token.access_token === "") {
        token = await getToken();
        await storeToken(token);
    }

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
    if (!data || data.length === 0) {
        console.error("No data found for the given query");
        return "No data found for the given query";
    }

    const names = getNames(data);
    console.log("Names extracted from data:", names);

    const result = search(query, names);
    return result;
}

function getNames(data: any): string[] {
    const results: string[] = [];

    for (const item of data) {
        if (item.name) {
            results.push(item.name);
        }
    }
    return results;
}