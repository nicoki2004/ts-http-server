
import type { Request, Response, NextFunction } from "express";
import { config } from "../config.ts";
import { respondWithError } from "./json.ts";
import { BadRequestError, ForbiddenRequestError, NotFoundError, UnauthorizedRequestError } from "./errors.ts";

export function middlewareLogResponse(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.on("finish", () => {
		const statusCode = res.statusCode;

		if (statusCode >= 300) {
			console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
		}
	});

	next();
}


export function middlewareMetricsInc(_req: Request, _res: Response, next: NextFunction): void {
	config.fileserverHits++;
	next();
}



export function errorMiddleWare(
	err: Error,
	_: Request,
	res: Response,
	__: NextFunction,
) {
	let statusCode = 500;
	let message = "Something went wrong on our end";

	if (statusCode >= 500) {
		console.log(err.message);
	}
	switch (true) {
		case err instanceof BadRequestError:
			statusCode = 400
			message = err.message
			break
		case err instanceof UnauthorizedRequestError:
			statusCode = 401
			message = err.message
			break
		case err instanceof ForbiddenRequestError:
			statusCode = 403
			message = err.message
			break
		case err instanceof NotFoundError:
			statusCode = 404
			message = err.message
			break
	}

	respondWithError(res, statusCode, message);
}
