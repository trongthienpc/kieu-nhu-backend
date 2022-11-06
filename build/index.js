"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
// import indexRouter from "./routes/index.routes";
var authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
var authentication_service_1 = require("./services/authentication.service");
var user_routes_1 = __importDefault(require("./routes/user.routes"));
var service_routes_1 = __importDefault(require("./routes/service.routes"));
var transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
var serviceGroup_routes_1 = __importDefault(require("./routes/serviceGroup.routes"));
var kpi_routes_1 = __importDefault(require("./routes/kpi.routes"));
dotenv_1.default.config();
// const allowCors = (fn: any) => async (req: Request, res: Response) => {
//   res.setHeader("Access-Control-Allow-Credentials", "*");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   // another common pattern
//   // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,OPTIONS,PATCH,DELETE,POST,PUT"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
//   );
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//     return;
//   }
//   return await fn(req, res);
// };
var corsConfig = {
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
// // app.use(allowCors);
app.use(express_1.default.json());
app.use((0, cors_1.default)(corsConfig));
app.use("*", (0, cors_1.default)(corsConfig));
app.use((0, cookie_parser_1.default)());
// app.use(express.static("./src/static"));
// // verify logged in user
app.use("*", authentication_service_1.tokenVerification);
// // app.use(morgan("dev"));
// // routes
// app.use("/", indexRouter);
// app.use("/", (req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   next();
// });
app.use("/api/auth", authentication_routes_1.default);
app.get("/", function (req, res, next) {
    res.send("Hello Typescript with Node.js!");
});
app.use("/api/user", user_routes_1.default);
app.use("/api/service", service_routes_1.default);
app.use("/api/service-group", serviceGroup_routes_1.default);
app.use("/api/transaction", transaction_routes_1.default);
app.use("/api/kpi", kpi_routes_1.default);
// // catch 404 and forward to error handler
// // app.use(function (req, res, next) {
// //   next(res.status(404).send("Sorry, the page was not found"));
// // });
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server is listening on ".concat(port));
});
// export default app;
