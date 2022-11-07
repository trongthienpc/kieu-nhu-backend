import express, { Request, Response } from "express";
import {
  getAllCustomers,
  getAllCustomerByUsername,
  getOneCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customer.service";

var customerRouter = express.Router();

// get all customers
customerRouter.get("/", async (req, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  const result = await getAllCustomers();

  if (result && result.data?.length > 0) {
    let totalPages = Math.ceil(result.data.length / pageSize);
    if (page > totalPages) page = totalPages;
    console.log(totalPages);
    return res.status(200).json({
      success: true,
      message: "Get customers successfully!",
      totalCustomers: result.data?.length,
      page: page,
      totalPages: totalPages,
      customers: result.data.slice(page * pageSize - pageSize, page * pageSize),
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any customer!",
      customers: [],
    });
  }
});

// get a customer
customerRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneCustomer(id);
  if (result) return res.status(200).json(result);
});

// create a new customer
customerRouter.post("/", async (req, res) => {
  const data = req.body;
  const result = await createCustomer(data);
  console.log(result);
  if (result) return res.status(200).json(result);
});

// update a customer
customerRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);
  if (data !== null && id !== null) {
    const result = await updateCustomer(data);
    console.log(result);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a customer
customerRouter.delete(":id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteCustomer(id);
  if (result) return res.status(200).json(result);
});

export default customerRouter;
