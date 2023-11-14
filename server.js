import express from "express";
import cors from 'cors';
import vetRoutes from "./Routes/vetRoutes.js";
import patientRoutes from "./Routes/patientRoutes.js";
import "dotenv/config";
import connectDB from "./config/db.js";
import corsOptions from "./helpers/corsOptions.js";
const app = express();

// Database connection
connectDB();

app.use(cors(corsOptions));

const port = process.env.PORT || 4000;

// Body parser
app.use(express.json());

// Routing
app.use("/api/vets", vetRoutes);
app.use("/api/patients", patientRoutes);

// Init server
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto: ${port}`);
});