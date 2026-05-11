import type { NextFunction, Request, Response } from "express";
import { createUser, getUserByEmail, updateUser, } from "../db/queries/users.ts";
import { BadRequestError, UserNotAuthenticatedError, } from "./errors.ts";
import { respondWithJSON } from "./json.ts";
import { getBearerToken, hashPassword, validateJWT } from "../auth.ts";
import type { NewUser } from "../db/schema.ts";
import { config } from "../config.ts";

export type UserResponse = Omit<NewUser, "hashedPassword">


export async function handlerCreateUser(req: Request, res: Response, next: NextFunction) {
	try {
		type parameters = {
			email: string;
			password: string
		};
		const params: parameters = req.body;

		if (!params.password || !params.email) {
			throw new BadRequestError("Missing required fields");
		}

		const hashedPassword = await hashPassword(params.password);

		const user = await createUser({
			email: params.email,
			hashedPassword,
		} satisfies NewUser);

		if (!user) {
			throw new Error("Could not create user");
		}

		respondWithJSON(res, 201, {
			id: user.id,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			isChirpyRed: user.isChirpyRed
		} satisfies UserResponse);


	} catch (e) {
		next(e)
	}



}


export function validateEmail(email?: string): string {
	if (!email) {
		throw new BadRequestError("Email is required");
	}

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		throw new BadRequestError("Invalid email format");
	}

	return email.toLowerCase();
}



export async function handlerUpdateUser(req: Request, res: Response, next: NextFunction) {
	try {
		type parameters = {
			email: string;
			password: string
		};
		const params: parameters = req.body;

		if (!params.password || !params.email) {
			throw new BadRequestError("Missing required fields");
		}

		let token = getBearerToken(req);
		if (!token) {
			throw new UserNotAuthenticatedError(`Invalid Token`)
		}

		const hashedPassword = await hashPassword(params.password);


		const userId = validateJWT(token, config.jwt.secret);


		const user = await updateUser(
			userId,
			params.email,
			hashedPassword,
		);

		if (!user) {
			throw new Error("Could not update user");
		}

		respondWithJSON(res, 200, {
			id: user.id,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			isChirpyRed: user.isChirpyRed
		} satisfies UserResponse);


	} catch (e) {
		next(e)
	}
}
