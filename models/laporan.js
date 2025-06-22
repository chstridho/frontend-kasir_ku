const express = require("express");
const router = express.Router();
const laporanController = require("../controllers/laporanController");

router.get("/", laporanController.index);
router.post("/generate-pdf", laporanController.generatePDF); // Tambahkan jika ingin export PDF

module.exports = router;
