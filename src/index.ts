import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./conf/swagger";
import orderRoutes from "./routes/orderRoutes";
import cors from "cors";
import { mongooseConnect } from "./middleware/DBMiddleware";
import { config } from "./conf/config";

var corsOptions = {
};

dotenv.config();

const app: Express = express();
const port = config.port;

mongooseConnect();

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', orderRoutes);

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});