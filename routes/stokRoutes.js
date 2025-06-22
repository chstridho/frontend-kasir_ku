const express = require('express');
const router = express.Router();
const stokController = require('../controllers/stokController');

// Tampilkan semua stok
router.get('/', stokController.index);

// Tampilkan form tambah produk
router.get('/tambah', stokController.create);

// Proses tambah produk
router.post('/', stokController.store);

// Tampilkan form edit produk
router.get('/edit/:id', stokController.formEdit);

// Proses update produk
router.post('/edit/:id', stokController.update);

// Hapus satu produk (POST untuk keamanan)
router.post('/hapus/:id', stokController.delete);

// Hapus semua produk
router.post('/hapus-semua', stokController.deleteAll);

module.exports = router;
