import type { NextFunction, Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.ts";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.ts";
import { respondWithJSON } from "./json.ts";
import type { UserResponse } from "./users.ts";
import { UserNotAuthenticatedError } from "./errors.ts";
import { config } from "../config.ts";
import { revokeRefreshToken, saveRefreshToken, userForRefreshToken } from "../db/queries/refresh_tokens.ts";

type LoginResponse = UserResponse & {
	token: string;
	refreshToken: string;
};

export async function handlerLogin(req: Request, res: Response) {
	type parameters = {
		password: string;
		email: string;
		// expiresIn?: number
	};

	const params: parameters = req.body;

	const user = await getUserByEmail(params.email);
	if (!user) {
		throw new UserNotAuthenticatedError("incorrect email or password");
	}

	const matching = await checkPasswordHash(
		params.password,
		user.hashedPassword,
	);
	if (!matching) {
		throw new UserNotAuthenticatedError("incorrect email or password");
	}

	let duration = config.jwt.defaultDuration;
	// if (params.expiresIn && !(params.expiresIn > config.jwt.defaultDuration)) {
	// 	duration = params.expiresIn;
	// }

	const accessToken = makeJWT(user.id, duration, config.jwt.secret);
	const refreshToken = makeRefreshToken();

	const saved = await saveRefreshToken(user.id, refreshToken);
	if (!saved) {
		throw new UserNotAuthenticatedError("could not save refresh token");
	}

	respondWithJSON(res, 200, {
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		token: accessToken,
		refreshToken: refreshToken,
		isChirpyRed: user.isChirpyRed
	} satisfies LoginResponse);
}


export async function handlerRefresh(req: Request, res: Response, next: NextFunction) {
	try {
		let refreshToken = getBearerToken(req);

		const result = await userForRefreshToken(refreshToken!);
		if (!result) {
			throw new UserNotAuthenticatedError("invalid refresh token");
		}

		const user = result.user;
		const accessToken = makeJWT(
			user.id,
			config.jwt.defaultDuration,
			config.jwt.secret,
		);

		type response = {
			token: string;
		};

		respondWithJSON(res, 200, {
			token: accessToken,
		} satisfies response);
	} catch (e) {
		next(e)
	}
}



export async function handlerRevoke(req: Request, res: Response, next: NextFunction) {
	try {
		const refreshToken = getBearerToken(req)

		if (!refreshToken) {
			throw new UserNotAuthenticatedError(`Invalid Token`)
		}

		await revokeRefreshToken(refreshToken)

		respondWithJSON(res, 204, {})

	} catch (e) {
		next(e)
	}
}






