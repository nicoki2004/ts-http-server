import express from "express";

import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
	errorMiddleWare,
	middlewareLogResponse,
	middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerChirps, handlerChirpsById, handlerChirpsCreate, } from "./api/chirps.ts";
import { config } from "./config.js";
import { handlerCreateUser, } from "./api/users.ts";
import { handlerLogin, handlerRefresh, handlerRevoke } from "./api/auth.ts";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
// app.post("/api/validate_chirp", handlerChirpsValidate)
app.post("/api/chirps", handlerChirpsCreate)
app.get("/api/chirps", handlerChirps)
app.get('/api/chirps/*chirpId', handlerChirpsById)
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);
app.post("/api/users", handlerCreateUser)
app.post("/api/login", handlerLogin)
app.post("/api/refresh", handlerRefresh)
app.post("/api/revoke", handlerRevoke)

// Middlwware error handling

app.use(errorMiddleWare);


app.listen(config.api.port, () => {
	console.log(`Server is running at http://localhost:${config.api.port}`);
});
