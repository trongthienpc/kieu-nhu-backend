import express, { Request, Response } from "express";
import { getAllServiceGroups } from "../services/serviceGroup.service";
import { getUser } from "../services/user.service";
const userRouter = express.Router();

userRouter.get("/get-user", async (req: Request, res: Response) => {
  console.log("userRouter.get-user");
  // console.log(req);
  const username = req.params?.username || "";
  const response = await getUser(username);
  res.json(response);
});

// get all users
userRouter.get("/", async (req, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  const result = await getAllServiceGroups();

  if (result && result.data?.length > 0) {
    let totalPages = Math.ceil(result.data.length / pageSize);
    if (page > totalPages) page = totalPages;
    console.log(totalPages);
    return res.status(200).json({
      success: true,
      message: "Get services successfully!",
      totalTransactions: result.data?.length,
      page: page,
      totalPages: totalPages,
      users: result.data.slice(page * pageSize - pageSize, page * pageSize),
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any transaction!",
      users: [],
    });
  }
});

export default userRouter;
