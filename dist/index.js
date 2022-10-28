"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
exports.app = app;
const dotenv_1 = __importDefault(require("dotenv"));
const index_routes_1 = __importDefault(require("./routes/index.routes"));
const authentication_routes_1 = __importDefault(require("./routes/authentication.routes"));
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// app.use(cors({ origin: true, credentials: true }));
app.use(express_1.default.static("./src/static"));
// verify logged in user
// app.use("*", tokenVerification);
// routes
app.use("/", index_routes_1.default);
app.use("/api", authentication_routes_1.default);
// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(res.status(404).send("Sorry, the page was not found"));
// });
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});
