import { Request, Response } from "express";
import { getToken } from "../utils/common";
import { Token } from "../utils/entities";

export default async function search(req: Request, res: Response) {
    const token: Token = await getToken();
    console.log("Token:", token);
    res.status(200).json({ message: "Search API is working!" });
}