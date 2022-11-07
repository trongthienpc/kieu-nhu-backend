import jwt from "jsonwebtoken";
import { getUser } from "./../services/user.service";
import express, { Request, Response } from "express";
import {
  checkUserExist,
  generateAccessToken,
  userLogin,
  userRegister,
} from "../services/authentication.service";
import { sleep } from "../utils/common";

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
    console.log(response);
    if (response.success) {
      // res.status(200).cookie("refreshToken", response.refreshToken, {
      //   httpOnly: true,
      //   secure: true, // change this to true if production
      //   sameSite: "strict",
      //   domain:
      //     process.env.NODE_ENV === "development" ? ".localhost" : ".vercel.com",
      //   path: "/",
      // });
    }
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
authenticationRouter.post("/refresh", async (req: Request, res: Response) => {
  console.log(`authentication.routes | tokenRefresh | ${req?.originalUrl}`);
  const username = req.body?.username;

  // get user by username
  const user = await getUser(username);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "user not found, may be refresh token is not valid",
    });
  } else {
    console.log("r", user.data?.refreshToken);
    try {
      jwt.verify(
        user.data?.refreshToken || "",
        process.env.TOKEN_SECRET || "",
        {
          ignoreExpiration: true,
        },
        async (error: any, decoded: any) => {
          if (error) {
            return {
              success: false,
              message: error?.name ? error?.name : "Invalid token",
              error: `Invalid token | ${error?.message}`,
            };
          } else {
            console.log("decoded: ", decoded);
            if (decoded?.username) {
              const newAccessToken = generateAccessToken(decoded?.username);
              console.log(newAccessToken);
              return res.status(200).json({
                success: true,
                message: "Token refreshed successfully",
                accessToken: newAccessToken,
              });
            } else {
              return res.status(401).json({
                success: false,
                message: error?.name ? error?.name : "Invalid Token",
                error: `Invalid token | ${error?.message}`,
              });
            }
          }
        }
      );
    } catch (error: any) {
      return res.status(501).json({
        success: false,
        message: error?.name ? error?.name : "Token refresh failed",
        error: `Token refresh failed | ${error?.message}`,
      });
    }
  }
});

// @route POST api/auth/logout
// desc logout

authenticationRouter.post("/logout", async (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully!" });
});
export default authenticationRouter;
