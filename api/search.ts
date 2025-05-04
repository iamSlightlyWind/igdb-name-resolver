import { Request, Response } from "express";
import { nameSearch } from "../utils/search";

export default async function search(req: Request, res: Response) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    const result = await nameSearch(query);
    res.status(200).json({ result });
    console.log("Query: ", query, " | Result:", result);
}