import { Request, Response } from "express";
import { nameSearch } from "../utils/common";

export default async function search(req: Request, res: Response) {
    await nameSearch("");
    res.status(200).json({ message: "Search API is working!" });
}