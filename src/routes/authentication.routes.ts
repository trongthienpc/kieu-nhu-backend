import express, { Request, Response } from "express";
import {
  checkUserExist,
  checkUsernameExist,
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
    console.log(`Authentication.routes | login : ${JSON.stringify(response)}`);
    res.json(response);
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
authenticationRouter.post("/refresh-token", tokenRefresh);

export default authenticationRouter;
