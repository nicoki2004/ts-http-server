import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
	api: APIConfig
	db: DBConfig
	jwt: JWTConfig;
	polka: PolkaConfig;
};

type PolkaConfig = {
	apiKey: string
}

type APIConfig = {
	fileServerHits: number;
	port: number;
	platform: string
};

type DBConfig = {
	url: string;
	migrationConfig: MigrationConfig;
};

type JWTConfig = {
	defaultDuration: number;
	secret: string;
	issuer: string;
	refreshDuration: number;
};

// process.loadEnvFile();

function envOrThrow(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`);
	}
	return value;
}

const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
	api: {
		fileServerHits: 0,
		port: Number(envOrThrow("PORT")),
		platform: process.env.PLATFORM || "prod"
	},
	db: {
		url: envOrThrow("DB_URL"),
		migrationConfig: migrationConfig,
	},
	jwt: {
		defaultDuration: 60 * 60, // 1 hour in seconds
		secret: envOrThrow("JWT_SECRET"),
		issuer: "chirpy",
		refreshDuration: 60 * 60 * 24 * 60 * 1000, // 60 days in milliseconds
	},

	polka: {
		apiKey: envOrThrow("POLKA_KEY")
	}

};
