import express, { Request, Response } from "express";
import { checkAdminRole } from "../services/authentication.service";
import {
  analyzeTransaction,
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getAllTransactionsByUsername,
  getOneTransactions,
  updateTransaction,
} from "../services/transaction.service";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../utils/dateTimeFn";

var transactionRouter = express.Router();

// get all transactions
transactionRouter.get("/", async (req: any, res) => {
  // page configs
  let p = req.query?.page || 1;
  let pz = req.query?.pageSize || 5;
  let page = parseInt(p.toString());
  const pageSize = parseInt(pz.toString());
  let search = req.query?.search || "";
  const isAdmin = await checkAdminRole(req.username);
  let result;
  if (isAdmin) result = await getAllTransactions(search);
  else result = await getAllTransactionsByUsername(req.username, search);

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

// analyze transactions by user
transactionRouter.get("/statistics", async (req, res) => {
  let date = new Date();
  let month =
    req.query.month === "undefined"
      ? date.getMonth() + 1
      : req.query.month || date.getMonth() + 1;
  let year =
    req.query?.year === "undefined"
      ? date.getFullYear()
      : req.query.year || date.getFullYear();

  var firstDate = getFirstDayOfMonth(
    parseInt(month.toString()),
    parseInt(year.toString())
  );
  var lastDate = getLastDayOfMonth(
    parseInt(month.toString()),
    parseInt(year.toString())
  );
  const result = await analyzeTransaction(firstDate, lastDate);
  if (result) return res.status(200).json(result);
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
