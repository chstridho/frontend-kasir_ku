const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.get('/', laporanController.index);
router.post('/generate-pdf', laporanController.generatePDF);
router.get('/export-excel', laporanController.exportExcel);

module.exports = router;
