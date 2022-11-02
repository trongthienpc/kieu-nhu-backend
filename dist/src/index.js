"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
const authentication_service_1 = require("./services/authentication.service");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const serviceGroup_routes_1 = __importDefault(require("./routes/serviceGroup.routes"));
dotenv_1.default.config();
const corsConfig = {
    credentials: true,
    // origin: [
    //   "http://localhost:3000",
    //   "http://localhost:3001",
    //   "http://192.168.4.89:3000",
    // ],
    origin: true,
};
app.use((0, cors_1.default)(corsConfig));
app.options("*", (0, cors_1.default)(corsConfig));
app.use(express_1.default.json());
// app.use(cors({ origin: true, credentials: true }));
app.use(express_1.default.static("./src/static"));
// verify logged in user
app.use("*", authentication_service_1.tokenVerification);
app.use((0, cookie_parser_1.default)());
// routes
app.use("/", index_routes_1.default);
app.use("/api/auth", authentication_routes_1.default);
app.use("/api/user", user_routes_1.default);
app.use("/api/service", service_routes_1.default);
app.use("/api/service-group", serviceGroup_routes_1.default);
app.use("/api/transaction", transaction_routes_1.default);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(res.status(404).send("Sorry, the page was not found"));
// });
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
