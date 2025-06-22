const Produk = require('../models/produk');

// Tampilkan semua stok
exports.index = async (req, res) => {
  try {
    const products = await Produk.find().lean();
    res.render('admin/stok', { produkList: products });
  } catch (error) {
    console.error('ERROR INDEX (STOK):', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data stok');
  }
};

// Form tambah produk untuk stok
exports.create = (req, res) => {
  res.render('admin/tambah_produk'); // Bisa diganti jika view-nya ingin dibedakan
};

// Simpan produk baru
exports.store = async (req, res) => {
  const { nama, harga, stok } = req.body;
  console.log('Received data (stok):', { nama, harga, stok });

  if (!nama || !harga || !stok) {
    return res.status(400).send('Semua field harus diisi');
  }

  try {
    const parsedHarga = parseInt(harga, 10);
    const parsedStok = parseInt(stok, 10);
    await Produk.create({ nama, harga: parsedHarga, stok: parsedStok });
    res.redirect('/stok');
  } catch (error) {
    console.error('ERROR STORE (STOK):', error);
    res.status(500).send('Gagal menambahkan produk (stok)');
  }
};

// Hapus produk dari stok
exports.delete = async (req, res) => {
  try {
    await Produk.findByIdAndDelete(req.params.id);
    res.redirect('/stok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menghapus produk dari stok');
  }
};

// Tampilkan form edit stok
exports.formEdit = async (req, res) => {
  try {
    const produk = await Produk.findById(req.params.id);
    res.render('admin/edit_produk', { produk });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat form edit stok');
  }
};

// Proses update stok
exports.update = async (req, res) => {
  const { nama, harga, stok } = req.body;
  try {
    await Produk.findByIdAndUpdate(req.params.id, { nama, harga, stok });
    res.redirect('/stok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memperbarui stok');
  }
};

// Hapus semua stok
exports.deleteAll = async (req, res) => {
  try {
    await Produk.deleteMany({});
    res.redirect('/stok');
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal menghapus semua stok');
  }
};
