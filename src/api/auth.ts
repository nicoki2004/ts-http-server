import type { Request, Response } from "express";
import { getUserByEmail } from "../db/queries/users.ts";
import { checkPasswordHash } from "../auth.ts";
import { respondWithJSON } from "./json.ts";
import type { UserResponse } from "./users.ts";
import { UserNotAuthenticatedError } from "./errors.ts";

export async function handlerLogin(req: Request, res: Response) {
	type parameters = {
		password: string;
		email: string;
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

	respondWithJSON(res, 200, {
		id: user.id,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	} satisfies UserResponse);
}
