import type { NextFunction, Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { createChirp, getAllChirps, getChirp, } from "../db/queries/chirps.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { getBearerToken, validateJWT } from "../auth.ts";
import { config } from "../config.ts";

export async function handlerChirpsCreate(req: Request, res: Response, next: NextFunction) {
	type parameters = {
		body: string;
	};

	try {

		const params: parameters = req.body;

		const token = getBearerToken(req);
		const userId = validateJWT(token!, config.jwt.secret);

		const cleaned = validateChirp(params.body);
		const chirp = await createChirp({ body: cleaned, userId: userId });

		respondWithJSON(res, 201, chirp);
	} catch (e) {
		next(e)
	}
}

function validateChirp(body: string) {
	const maxChirpLength = 140;
	if (body.length > maxChirpLength) {
		throw new BadRequestError(
			`Chirp is too long. Max length is ${maxChirpLength}`,
		);
	}

	const badWords = ["kerfuffle", "sharbert", "fornax"];
	return getCleanedBody(body, badWords);
}

function getCleanedBody(body: string, badWords: string[]) {
	const words = body.split(" ");

	for (let i = 0; i < words.length; i++) {
		const word = words[i]!;
		const loweredWord = word.toLowerCase();
		if (badWords.includes(loweredWord)) {
			words[i] = "****";
		}
	}

	const cleaned = words.join(" ");
	return cleaned;
}


export async function handlerChirps(req: Request, res: Response, next: NextFunction) {
	try {
		const chirps = await getAllChirps()
		respondWithJSON(res, 200, chirps)

	} catch (e) {
		next(e)
	}

}


export async function handlerChirpsById(req: Request, res: Response, next: NextFunction) {

	try {

		const { chirpId } = req.params;

		if (typeof chirpId !== "string") {
			throw new BadRequestError("Invalid chirp ID");
		}

		const chirp = await getChirp(chirpId);
		if (!chirp) {
			throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
		}

		respondWithJSON(res, 200, chirp);

	} catch (e) {
		next(e)
	}

}
