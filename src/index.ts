import express from "express";

import { handlerReadiness } from "./api/readiness.js";
import { handlerMetrics } from "./api/metrics.js";
import { handlerReset } from "./api/reset.js";
import {
	errorMiddleWare,
	middlewareLogResponse,
	middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerChirpsValidate } from "./api/chirps.ts";

const app = express();
const PORT = 8080;

app.use(middlewareLogResponse);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.post("/api/validate_chirp", handlerChirpsValidate)
app.get("/admin/metrics", handlerMetrics);
app.post("/admin/reset", handlerReset);

// Middlwware error handling

app.use(errorMiddleWare);


app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
