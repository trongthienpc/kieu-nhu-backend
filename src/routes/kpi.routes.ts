import express, { Request, Response } from "express";
import { checkAdminRole } from "../services/authentication.service";
import {
  createKpi,
  deleteKpi,
  getAllKpis,
  getAllKpisByUsername,
  getOneKpis,
  updateKpi,
} from "../services/kpi.service";

import { getFirstDayOfMonth, getLastDayOfMonth } from "../utils/dateTimeFn";

var kpiRouter = express.Router();

// get all kpis
kpiRouter.get("/", async (req: any, res) => {
  // page configs
  const isAdmin = await checkAdminRole(req.username);
  let result;
  if (isAdmin) result = await getAllKpis();
  else result = await getAllKpisByUsername(req.username);

  console.log(result);
  if (result && result.data?.length > 0) {
    return res.status(200).json({
      success: true,
      message: "Get kpis successfully!",
      kpis: result.data,
    });
  } else {
    return res.json({
      success: true,
      message: "Can not found any kpi!",
      kpis: [],
    });
  }
});

// get a kpi
kpiRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await getOneKpis(id);
  if (result) return res.status(200).json(result);
});

// create a new kpi
kpiRouter.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);
  const result = await createKpi(data);
  if (result) return res.status(200).json(result);
});

// update a kpi
kpiRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  if (data !== null && id !== null) {
    const result = await updateKpi(data);
    if (result) {
      return res.status(200).json(result);
    }
  }
});

// delete a kpi
kpiRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const result = await deleteKpi(id);
  if (result) return res.status(200).json(result);
});

export default kpiRouter;
