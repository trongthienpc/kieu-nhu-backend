import express, { Request, Response } from "express";
import {
  createServiceGroup,
  deleteServiceGroup,
  getAllServiceGroups,
  getOneServiceGroup,
  updateServiceGroup,
} from "../services/serviceGroup.service";

var serviceGroupRouter = express.Router();
// var log = console.log;
// console.log = function () {
//   log.apply(console);
//   // Print the stack trace
//   console.trace();
// };

// get all service groups
serviceGroupRouter.get("/", async (req: Request, res: Response) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  const result = await getAllServiceGroups();

  if (result && result.data?.length > 0) {
    let totalPages = Math.ceil(result.data.length / pageSize);
    if (page > totalPages) page = totalPages;
    // console.log(totalPages);
    return res.status(200).json({
      success: true,
      message: "Get service groups successfully!",
      totalGroups: result.data?.length,
      page: page,
      totalPages: totalPages,
      groups: result.data.slice(page * pageSize - pageSize, page * pageSize),
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any service group!",
      groups: [],
    });
  }
});

// get a service group
serviceGroupRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneServiceGroup(id);
  if (result) return res.status(200).json(result);
});

// create a new service group
serviceGroupRouter.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await createServiceGroup(data);
  if (result) return res.status(200).json(result);
});

// update a service group
serviceGroupRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  if (data !== null && id !== null) {
    const result = await updateServiceGroup(data);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a service group
serviceGroupRouter.delete(":id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteServiceGroup(id);
  if (result) return res.status(200).json(result);
});

export default serviceGroupRouter;
