const Produk = require('../models/produk');
const bcrypt = require('bcryptjs');

// Tampilkan semua produk
exports.index = async (req, res) => {
  try {
    const produkList = await Produk.find().lean();
    res.render('admin/produk', {
      produkList,
      currentPage: 'produk' // ✅ tambahkan ini
    });
  } catch (error) {
    console.error('ERROR INDEX:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data produk');
  }
};


// Tampilkan form tambah produk
exports.create = (req, res) => {
  res.render('admin/tambah_produk');
};

// Simpan produk baru
exports.store = async (req, res) => {
  const { nama, harga, stok } = req.body;
  console.log('Received data:', { nama, harga, stok }); // Debugging

  // Validasi input
  if (!nama || !harga || !stok) {
    return res.status(400).send('Semua field harus diisi');
  }

  try {
    // Konversi harga dan stok menjadi Number
    const parsedHarga = parseInt(harga, 10);
    const parsedStok = parseInt(stok, 10);

    // Simpan produk ke database
    await Produk.create({ nama, harga: parsedHarga, stok: parsedStok });
    res.redirect('/produk');
  } catch (error) {
    console.error('ERROR STORE:', error);
    res.status(500).send('Gagal menambahkan produk');
  }
};

// Hapus produk
exports.delete = async (req, res) => {
try {
await Produk.findByIdAndDelete(req.params.id);
res.redirect('/produk');
} catch (error) {
console.error(error);
res.status(500).send('Gagal menghapus produk');
}
};

// Tampilkan form edit produk
exports.formEdit = async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    res.render('admin/edit_produk', { produk });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat form edit');
  }
};

// Proses update produk
exports.update = async (req, res) => {
  const { nama, harga, stok } = req.body;
  try {
    await Produk.findByIdAndUpdate(req.params.id, { nama, harga, stok });
    res.redirect('/produk');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memperbarui produk');
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await Produk.deleteMany({});
    res.redirect('/stok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menghapus semua produk');
  }
};