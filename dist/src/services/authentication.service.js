"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExist = exports.checkUsernameExist = exports.checkEmailExist = exports.userLogin = exports.userRegister = exports.tokenVerification = exports.tokenRefresh = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const constants_1 = require("../configs/constants");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
// const prisma = new PrismaClient();
// const prisma = new PrismaClient({ log: ["query", "info", "warn"] });
// check [type] is exist
const checkUserExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let messages = {
        email: constants_1.EMAIL_EXIST,
        username: constants_1.USERNAME_EXIST,
    };
    // console.log(query);
    try {
        let queryType = Object.keys(query)[0];
        let userObject = yield prisma_1.default.users.findFirst({
            where: query,
        });
        return !userObject
            ? { success: true, message: `This ${queryType} is not taken` }
            : {
                success: false,
                message: messages[queryType],
            };
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkUserExist = checkUserExist;
// check username already exist
const checkUsernameExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.users.findFirst({
        where: {
            username: query,
        },
    });
    if (user)
        return constants_1.USERNAME_EXIST;
    return true;
});
exports.checkUsernameExist = checkUsernameExist;
// check email already exist
const checkEmailExist = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.users.findFirst({
        where: {
            email: query,
        },
    });
    if (user)
        return constants_1.EMAIL_EXIST;
    return true;
});
exports.checkEmailExist = checkEmailExist;
// user register
const userRegister = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        console.log(`Authentication | user registration`);
        if (!(user === null || user === void 0 ? void 0 : user.username) || !(user === null || user === void 0 ? void 0 : user.password))
            return {
                success: false,
                message: "Please fill up all the required information",
            };
        // check email already exist
        const emailStatus = yield checkEmailExist(user === null || user === void 0 ? void 0 : user.email);
        if (emailStatus != true)
            return { success: false, message: constants_1.EMAIL_EXIST };
        // check username already exist
        const usernameStatus = yield checkUsernameExist(user === null || user === void 0 ? void 0 : user.username);
        if (usernameStatus != true)
            return { success: false, message: constants_1.USERNAME_EXIST };
        const passwordHash = yield bcrypt_1.default.hash(user === null || user === void 0 ? void 0 : user.password, 10);
        let userObject = {
            username: (_a = user === null || user === void 0 ? void 0 : user.username) === null || _a === void 0 ? void 0 : _a.toLowerCase(),
            password: passwordHash,
            email: (_b = user === null || user === void 0 ? void 0 : user.email) === null || _b === void 0 ? void 0 : _b.toLowerCase(),
            name: (_c = user === null || user === void 0 ? void 0 : user.name) === null || _c === void 0 ? void 0 : _c.toLowerCase(),
            admin: (user === null || user === void 0 ? void 0 : user.admin) || false,
        };
        // save to database
        const newUser = yield prisma_1.default.users.create({
            data: userObject,
        });
        // create toke for user registration
        if (newUser) {
            let accessToken = jsonwebtoken_1.default.sign({ username: userObject === null || userObject === void 0 ? void 0 : userObject.username, email: userObject === null || userObject === void 0 ? void 0 : userObject.email }, process.env.TOKEN_SECRET || "", {
                expiresIn: "10m",
            });
            return {
                success: true,
                message: constants_1.REGISTERED_SUCCESS,
                data: accessToken,
            };
        }
        else {
            return { success: false, message: constants_1.REGISTERED_FAILED };
        }
    }
    catch (error) {
        console.log(error === null || error === void 0 ? void 0 : error.message);
        let errorMessage = constants_1.REGISTERED_FAILED;
        (error === null || error === void 0 ? void 0 : error.code) === 11000 && ((_d = error === null || error === void 0 ? void 0 : error.keyPattern) === null || _d === void 0 ? void 0 : _d.username)
            ? (errorMessage = "Username already exist")
            : null;
        (error === null || error === void 0 ? void 0 : error.code) === 11000 && ((_e = error === null || error === void 0 ? void 0 : error.keyPattern) === null || _e === void 0 ? void 0 : _e.email)
            ? (errorMessage = "Email already exist")
            : null;
        return { success: false, message: errorMessage, data: error === null || error === void 0 ? void 0 : error.toString() };
    }
});
exports.userRegister = userRegister;
// user login
const userLogin = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(user === null || user === void 0 ? void 0 : user.username) || !user.password)
            return { success: false, message: "Please fill up all the fields" };
        const userObject = yield prisma_1.default.users.findFirst({
            where: {
                username: user.username.toLowerCase(),
            },
        });
        if (userObject) {
            let isPasswordVerified = yield bcrypt_1.default.compare(user === null || user === void 0 ? void 0 : user.password, userObject.password);
            if (isPasswordVerified) {
                const { password } = userObject, userInfo = __rest(userObject, ["password"]);
                let accessToken = (0, exports.generateAccessToken)(userObject.username);
                const refreshToken = (0, exports.generateRefreshToken)(userObject.username);
                yield prisma_1.default.users.update({
                    where: {
                        id: userObject.id,
                    },
                    data: {
                        refreshToken: refreshToken,
                    },
                });
                return {
                    success: true,
                    message: "User login successful",
                    data: Object.assign(Object.assign({}, userInfo), { accessToken }),
                    refreshToken: refreshToken,
                };
            }
            else {
                return {
                    success: false,
                    message: "Incorrect password",
                };
            }
        }
        else {
            return {
                success: false,
                message: "No user found",
            };
        }
    }
    catch (error) {
        console.log(error);
        return {
            success: false,
            message: "User login failed",
            error: error === null || error === void 0 ? void 0 : error.toString(),
        };
    }
});
exports.userLogin = userLogin;
// @desc generate new access token
// @param user id
const generateAccessToken = (username) => {
    return jsonwebtoken_1.default.sign({ username: username }, process.env.TOKEN_SECRET || "", {
        expiresIn: "10s",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (username) => {
    return jsonwebtoken_1.default.sign({ username: username }, process.env.TOKEN_SECRET || "", {
        expiresIn: "30d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
// check token validity
const tokenVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h, _j, _k;
    console.log(`authentication.service | tokenVerification ${req.originalUrl}`);
    try {
        if (((_f = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _f === void 0 ? void 0 : _f.includes("/login")) ||
            ((_g = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _g === void 0 ? void 0 : _g.includes("/user-exist")) ||
            ((_h = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _h === void 0 ? void 0 : _h.includes("/register")) ||
            ((_j = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _j === void 0 ? void 0 : _j.includes("/refresh")) ||
            ((_k = req === null || req === void 0 ? void 0 : req.originalUrl) === null || _k === void 0 ? void 0 : _k.includes("/logout")))
            return next();
        let token = req === null || req === void 0 ? void 0 : req.headers.token;
        // console.log(token);
        if (token && token.startsWith("Bearer ")) {
            const accessToken = token.split(" ")[1];
            jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET || "", (error, decoded) => {
                if (error) {
                    return res.status(401).json({
                        success: false,
                        message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                        error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                    });
                }
                else {
                    req.username = decoded === null || decoded === void 0 ? void 0 : decoded.username;
                    next();
                }
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
                error: "Token is missing",
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.message) ? error === null || error === void 0 ? void 0 : error.message : "Authentication failed",
            error: `Authentication failed | ${error === null || error === void 0 ? void 0 : error.message}`,
        });
    }
});
exports.tokenVerification = tokenVerification;
function greeting() {
    console.log("Hello World");
}
// refresh token validity
const tokenRefresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    console.log(`authentication.service | tokenRefresh | ${req === null || req === void 0 ? void 0 : req.originalUrl}`);
    try {
        // let token = req?.headers["authorization"];
        // take refresh token from user
        let refreshToken = (_l = req.cookies) === null || _l === void 0 ? void 0 : _l.refreshToken;
        // console.log(req);
        if (refreshToken) {
            // token = token.slice(7, token?.length);
            const foundUser = yield prisma_1.default.users.findFirst({
                where: {
                    refreshToken: refreshToken,
                },
            });
            console.log(foundUser);
            // setTimeout(greeting, 3000);
            if (!foundUser) {
                return res
                    .status(401)
                    .json("user not found, may be refresh token is not valid");
            }
            else {
                jsonwebtoken_1.default.verify(refreshToken, process.env.TOKEN_SECRET || "", {
                    ignoreExpiration: true,
                }, (error, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                    if (error) {
                        return res.status(401).json({
                            success: false,
                            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid token",
                            error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                        });
                    }
                    else {
                        console.log(decoded);
                        if (decoded === null || decoded === void 0 ? void 0 : decoded.username) {
                            const newAccessToken = (0, exports.generateAccessToken)(foundUser === null || foundUser === void 0 ? void 0 : foundUser.username);
                            const newRefreshToken = (0, exports.generateRefreshToken)(foundUser === null || foundUser === void 0 ? void 0 : foundUser.username);
                            const updateData = yield prisma_1.default.users.update({
                                where: {
                                    username: foundUser.username,
                                },
                                data: {
                                    refreshToken: newRefreshToken,
                                },
                            });
                            res.cookie("refreshToken", newRefreshToken, {
                                httpOnly: true,
                                secure: false,
                                sameSite: "strict",
                            });
                            return res.json({
                                success: true,
                                message: "Token refreshed successfully",
                                accessToken: newAccessToken,
                            });
                        }
                        else {
                            return res.status(401).json({
                                success: false,
                                message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Invalid Token",
                                error: `Invalid token | ${error === null || error === void 0 ? void 0 : error.message}`,
                            });
                        }
                    }
                }));
            }
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Token not found or token not valid",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: (error === null || error === void 0 ? void 0 : error.name) ? error === null || error === void 0 ? void 0 : error.name : "Token refresh failed",
            error: `Token refresh failed | ${error === null || error === void 0 ? void 0 : error.message}`,
        });
    }
});
exports.tokenRefresh = tokenRefresh;
