const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard', userController.dashboard);
router.post('/beli', userController.beli);
router.post('/hapus-riwayat', userController.hapusRiwayat);
router.get('/dashboard/cetak', userController.cetakLaporan);

module.exports = router;
