import type { NextFunction, Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.ts";

const forbiddenWords = ["kerfuffle", "sharbert", "fornax"]
const replacement = "****"

export async function handlerChirpsValidate(req: Request, res: Response, next: NextFunction) {
	type parameters = {
		body: string;
	};

	try {

		const params: parameters = req.body;

		const maxChirpLength = 140;
		if (params.body.length > maxChirpLength) {
			throw new BadRequestError("Chirp is too long. Max length is 140");
			// respondWithError(res, 400, "Chirp is too long");
			// return;
		}

		const words = params.body.split(" ");

		for (let i = 0; i < words.length; i++) {
			const word = words[i] || ""
			const loweredWord = word.toLowerCase();
			if (forbiddenWords.includes(loweredWord)) {
				words[i] = replacement;
			}
		}
		const cleanedBody = words.join(" ");

		respondWithJSON(res, 200, {
			cleanedBody: cleanedBody,
		});
	} catch (e) {
		next(e)
	}
}



