import type { NextFunction, Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { createChirp, deleteChirp, getAllChirps, getChirp, getChirpsByAuthor, } from "../db/queries/chirps.js";
import { BadRequestError, ForbiddenRequestError, NotFoundError, UserNotAuthenticatedError } from "./errors.js";
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
		let authorId = "";
		let authorIdQuery = req.query.authorId;
		const sort = req.query.sort
		if (typeof authorIdQuery === "string") {
			authorId = authorIdQuery;
		}

		let chirps
		if (authorId !== "") {
			chirps = await getChirpsByAuthor(authorId);
		} else {
			chirps = await getAllChirps()
		}

		const sortDirection = sort === "desc" ? "desc" : "asc";

		chirps.sort((a, b) =>
			sortDirection === "asc"
				? a.createdAt.getTime() - b.createdAt.getTime()
				: b.createdAt.getTime() - a.createdAt.getTime(),
		);


		respondWithJSON(res, 200, chirps)

	} catch (e) {
		next(e)
	}

}


export async function handlerChirpsById(req: Request, res: Response, next: NextFunction) {

	try {


		const { chirpId } = req.params;


		if (!chirpId || typeof chirpId !== "string") {
			throw new BadRequestError(`Invalid chirp ID`);
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

export async function handlerChirpDelete(req: Request, res: Response, next: NextFunction) {
	try {


		let token = getBearerToken(req);
		if (!token) {
			throw new UserNotAuthenticatedError(`Invalid Token`)
		}

		const userId = validateJWT(token, config.jwt.secret);

		const { chirpId } = req.params

		if (!chirpId || typeof chirpId !== "string") {
			throw new BadRequestError("Invalid chirp ID");
		}

		const chirp = await getChirp(chirpId);
		if (!chirp) {
			throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
		}

		if (chirp.userId !== userId) {
			throw new ForbiddenRequestError(`You cannot delete this chrip`)
		}

		await deleteChirp(chirpId)

		respondWithJSON(res, 204, {})



	} catch (e) {
		next(e)
	}
}
