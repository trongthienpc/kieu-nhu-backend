import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
const app: Express = express();
import indexRouter from "./routes/index.routes";
import authenticationRouter from "./routes/authentication.routes";
import { tokenVerification } from "./services/authentication.service";
import userRouter from "./routes/user.routes";
import serviceRouter from "./routes/service.routes";
import transactionRouter from "./routes/transaction.routes";
import serviceGroupRouter from "./routes/serviceGroup.routes";
import kpiRouter from "./routes/kpi.routes";
dotenv.config();

app.use(cookieParser());

const allowCors = (fn: any) => async (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Credentials", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

const corsConfig = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://192.168.4.89:3000",
    "http://192.168.1.8:3000",
    "https://kieu-nhu.vercel.app",
  ],
  // origin: true,
};
app.use(allowCors);
app.use(express.json());

app.use(cors(corsConfig));
app.use("*", cors(corsConfig));
app.use(express.static("./src/static"));

// verify logged in user
app.use("*", tokenVerification);
// app.use(morgan("dev"));
// routes
app.use("/", indexRouter);
// app.use("/", (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });

app.use("/api/auth", cors(corsConfig), authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/service", serviceRouter);
app.use("/api/service-group", serviceGroupRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/kpi", kpiRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(res.status(404).send("Sorry, the page was not found"));
// });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
export { app };
