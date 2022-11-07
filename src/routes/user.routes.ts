import express, { Request, Response } from "express";
import { getAllUsers, getUser } from "../services/user.service";

const userRouter = express.Router();

// get all users
userRouter.get("/", async (req, res) => {
  const result = await getAllUsers();
  console.log(result);
  if (result) {
    return res.status(200).json({
      success: true,
      message: "Get users successfully!",
      users: result.data,
    });
  } else {
    return res.json({
      success: false,
      message: "Oops! Something went wrong!",
      users: [],
    });
  }
});

userRouter.get("/get-user", async (req: Request, res: Response) => {
  console.log("userRouter.get-user");
  // console.log(req);
  const username = req.params?.username || "";
  const response = await getUser(username);
  res.json(response);
});

// reset password by user name
userRouter.post("/reset-password", async (req: Request, res: Response) => {
  const { username } = req.body;
});

export default userRouter;
