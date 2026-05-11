import { asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps, type NewChirp } from "../schema.ts";

export async function createChirp(chirp: NewChirp) {
	const [result] = await db.insert(chirps)
		.values(chirp)
		.onConflictDoNothing()
		.returning()
	return result
}

export async function getAllChirps() {
	return await db.select().from(chirps).orderBy(asc(chirps.createdAt))
}


export async function getChirp(chirpId: string) {
	const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpId)).orderBy(asc(chirps.createdAt))
	return result
}

export async function deleteChirp(id: string) {
	const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
	return rows.length > 0;
}
