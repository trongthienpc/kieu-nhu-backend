import express, { Request, Response } from "express";
import prisma from "../../lib/prisma";
import jwt from "jsonwebtoken";
import {
  checkUserExist,
  checkUsernameExist,
  generateAccessToken,
  generateRefreshToken,
  tokenRefresh,
  userLogin,
  userRegister,
} from "../services/authentication.service";
var authenticationRouter = express.Router();

// user registration
authenticationRouter.post(
  "/register",
  async (req: Request, res: Response, next: any) => {
    let body = req.body;
    console.log(`authenticationRouter | register`);
    let response = await userRegister(body);
    return res.status(200).json(response);
  }
);

// user login
authenticationRouter.post(
  "/login",
  async (req: Request, res: Response, next: any) => {
    let body = req.body;
    let response = await userLogin(body);
    if (response.success)
      res.cookie("refreshToken", response.refreshToken, {
        httpOnly: true,
        secure: false, // change this to true if production
        sameSite: "strict",
        path: "/",
      });
    console.log(`Authentication.routes | login`);
    const { refreshToken, ...responseData } = response;
    return res.json({
      success: responseData.success,
      data: responseData.data,
      message: responseData.message,
    });
  }
);

// user exist
authenticationRouter.get(
  "/user-exist",
  async (req: Request, res: Response, next: any) => {
    let params = req.query;
    console.log(params);
    let response = await checkUserExist(params);
    res.json(response);
  }
);

// refresh token
authenticationRouter.post("/refresh", tokenRefresh);

// @route POST api/auth/logout
// desc logout

authenticationRouter.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully!" });
});
export default authenticationRouter;
