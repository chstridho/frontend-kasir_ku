const express = require('express');
const router = express.Router();
const penjualanController = require('../controllers/penjualanController');

router.get('/', penjualanController.index);
router.post('/hapus-semua', penjualanController.hapusSemua);
router.get('/cetak-pdf', penjualanController.cetakPDF);
router.get('/export-excel', penjualanController.exportExcel);



module.exports = router;
