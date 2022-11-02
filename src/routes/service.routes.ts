import express, { Request, Response } from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getOneServices,
  updateService,
} from "../services/service.service";

var serviceRouter = express.Router();

// get all services
serviceRouter.get("/", async (req, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  const result = await getAllServices();

  if (result && result.data?.length > 0) {
    let totalPages = Math.ceil(result.data.length / pageSize);
    if (page > totalPages) page = totalPages;
    console.log(totalPages);
    return res.status(200).json({
      success: true,
      message: "Get services successfully!",
      totalServices: result.data?.length,
      page: page,
      totalPages: totalPages,
      services: result.data.slice(page * pageSize - pageSize, page * pageSize),
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any service!",
      services: [],
    });
  }
});

// get a service
serviceRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneServices(id);
  if (result) return res.status(200).json(result);
});

// create a new service
serviceRouter.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await createService(data);
  if (result) return res.status(200).json(result);
});

// update a service
serviceRouter.put(":id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data !== null && id !== null) {
    const result = await updateService(data);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a service
serviceRouter.delete(":id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteService(id);
  if (result) return res.status(200).json(result);
});

export default serviceRouter;
