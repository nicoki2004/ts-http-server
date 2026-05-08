
import type { Request, Response, NextFunction } from "express";
import { config } from "../config.ts";

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
