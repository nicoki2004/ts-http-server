import { db } from "../index.js";
import { users, type NewUser } from "../schema.ts";

export async function createUser(user: NewUser) {
	const [result] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}
