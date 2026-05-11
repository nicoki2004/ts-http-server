import type { NextFunction, Request, Response } from "express";
import { updatePolka } from "../db/queries/users.ts";
import { respondWithJSON } from "./json.ts";
import { NotFoundError, UnauthorizedRequestError } from "./errors.ts";
import { getAPIKey } from "../auth.ts";
import { config } from "../config.ts";



export async function handlerPolka(req: Request, res: Response, next: NextFunction) {
	try {

		type parameters = {
			event: string,
			data: {
				userId: string
			}
		}

		const apiKey = getAPIKey(req)
		if (apiKey !== config.polka.apiKey) {
			throw new UnauthorizedRequestError("Invalid API Key");
		}

		const params: parameters = req.body


		if (params.event === "user.upgraded") {
			const user = await updatePolka(params.data.userId)
			if (!user) {
				throw new NotFoundError(`User not found`)
			}

		}

		respondWithJSON(res, 204, {})


	} catch (e) {
		next(e)
	}
}
