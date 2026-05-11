import type { NextFunction, Request, Response } from "express";
import { updatePolka } from "../db/queries/users.ts";
import { respondWithJSON } from "./json.ts";
import { NotFoundError } from "./errors.ts";



export async function handlerPolka(req: Request, res: Response, next: NextFunction) {
	try {

		type parameters = {
			event: string,
			data: {
				userId: string
			}
		}

		const params: parameters = req.body


		if (params.event === "user.upgraded") {
			const user = updatePolka(params.data.userId)
			if (!user) {
				throw new NotFoundError(`User not found`)
			}

		}

		respondWithJSON(res, 204, {})


	} catch (e) {
		next(e)
	}
}
