import express, { Request, Response } from "express";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getOneTransactions,
  updateTransaction,
} from "../services/transaction.service";

var transactionRouter = express.Router();

// get all services
transactionRouter.get("/", async (req, res) => {
  const result = await getAllTransactions();
  if (result) return res.status(200).json(result);
});

// get a service
transactionRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneTransactions(id);
  if (result) return res.status(200).json(result);
});

// create a new service
transactionRouter.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await createTransaction(data);
  if (result) return res.status(200).json(result);
});

// update a service
transactionRouter.put(":id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data !== null && id !== null) {
    const result = await updateTransaction(data);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a service
transactionRouter.delete(":id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteTransaction(id);
  if (result) return res.status(200).json(result);
});

export default transactionRouter;
