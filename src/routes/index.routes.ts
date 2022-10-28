import express from "express";

const router = express.Router();

// get home page

router.get("/", (req, res) => {
  return res.send("<p>Server started!</p>");
});

export default router;
