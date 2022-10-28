import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
const app: Express = express();
import dotenv from "dotenv";
import indexRouter from "./routes/index.routes";
import authenticationRouter from "./routes/authentication.routes";
import { tokenVerification } from "./services/authentication.service";
import userRouter from "./routes/user.routes";
import serviceRouter from "./routes/service.routes";
import transactionRouter from "./routes/transaction.routes";
dotenv.config();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: true, credentials: true }));

app.use(express.static("./src/static"));

// verify logged in user
app.use("*", tokenVerification);

// routes
app.use("/", indexRouter);

app.use("/api", authenticationRouter);
app.use("/api/user", userRouter);
app.use("/api/service", serviceRouter);
app.use("/api/transaction", transactionRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(res.status(404).send("Sorry, the page was not found"));
// });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
export { app };
