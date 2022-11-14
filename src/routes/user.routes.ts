import express, { Request, Response } from "express";
import { getAllUsers, getUser, resetPassword } from "../services/user.service";

const userRouter = express.Router();

// get all users
userRouter.get("/", async (req, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  let search = req.query?.search || "";

  let result;
  result = await getAllUsers();
  // console.log(result);
  if (result) {
    let totalPages = Math.ceil(result.data.length / pageSize);
    if (page > totalPages) page = totalPages;
    return res.status(200).json({
      success: true,
      message: "Get users successfully!",
      users: result.data.slice(page * pageSize - pageSize, page * pageSize),
      page: page,
      totalPages: totalPages,
      totalUsers: result.data.length,
    });
  } else {
    return res.json({
      success: false,
      message: "Oops! Something went wrong!",
      users: [],
    });
  }
});

// get a user info
// @param username: string
userRouter.get("/get-user", async (req: Request, res: Response) => {
  console.log("userRouter.get-user");
  // console.log(req);
  const username = req.params?.username || "";
  const response = await getUser(username);
  res.json(response);
});

// reset password by user name
// @param username:  string
userRouter.post("/reset-password", async (req: Request, res: Response) => {
  const { username, updatedBy } = req.body;
  if (username) {
    const response = await resetPassword(username, updatedBy);
    res.status(202).json(response);
  } else {
    res.status(404).json({
      success: false,
      message: "user name is not founded",
    });
  }
});

export default userRouter;
