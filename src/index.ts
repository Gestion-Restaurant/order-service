import express, { Express } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./conf/swagger";
import orderRoutes from "./routes/order.routes";
import { mongooseConnect } from "./middleware/DBMiddleware";
import { config } from "./conf/config";

dotenv.config();

const app: Express = express();
const port = config.port;


mongooseConnect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at http://localhost:${port}`);
});

app.use('/orders', orderRoutes);