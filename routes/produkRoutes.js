const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

// Tampilkan semua produk
router.get('/produk', produkController.index);

// Form tambah produk
router.get('/produk/tambah', produkController.create);

// Simpan produk baru
router.post('/produk', produkController.store);

// Tampilkan form edit
router.get('/produk/edit/:id', produkController.formEdit);

// Proses update produk
router.post('/produk/edit/:id', produkController.update);

// ✅ Hapus produk (gunakan POST, bukan GET)
router.post('/produk/hapus/:id', produkController.delete);


module.exports = router;