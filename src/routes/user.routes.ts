import express, { Request, Response } from "express";
import { getUser } from "../services/user.service";
const userRouter = express.Router();

userRouter.get("/get-user", async (req: Request, res: Response) => {
  console.log("userRouter.get-user");
  // console.log(req);
  const username = req.params?.username || "";
  const response = await getUser(username);
  res.json(response);
});

export default userRouter;
