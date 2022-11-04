import express, { Request, Response } from "express";
import { checkAdminRole } from "../services/authentication.service";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getAllTransactionsByUsername,
  getOneTransactions,
  updateTransaction,
} from "../services/transaction.service";

var transactionRouter = express.Router();

// get all transactions
transactionRouter.get("/", async (req: any, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  const isAdmin = await checkAdminRole(req.username);
  let result;
  if (isAdmin) result = await getAllTransactions();
  else result = await getAllTransactionsByUsername(req.username);

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
      transactions: result.data.slice(
        page * pageSize - pageSize,
        page * pageSize
      ),
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any transaction!",
      transactions: [],
    });
  }
});

// get a transaction
transactionRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneTransactions(id);
  if (result) return res.status(200).json(result);
});

// create a new transaction
transactionRouter.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await createTransaction(data);
  if (result) return res.status(200).json(result);
});

// update a transaction
transactionRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data !== null && id !== null) {
    const result = await updateTransaction(data);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a transaction
transactionRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteTransaction(id);
  if (result) return res.status(200).json(result);
});

export default transactionRouter;
