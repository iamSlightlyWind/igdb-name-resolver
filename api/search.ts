import { Request, Response } from "express";
import { nameSearch } from "../utils/common";

export default async function search(req: Request, res: Response) {
    const { query } = req.query;
    console.log("Query:", query);

    if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    await nameSearch(query);
    res.status(200).json({ message: "Search API is working!" });
}