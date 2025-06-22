const Produk = require('../models/produk');
const Penjualan = require('../models/penjualan');
const pdf = require('html-pdf');
const ejs = require('ejs');
const path = require('path');

exports.dashboard = async (req, res) => {
  try {
    const produkList = await Produk.find({ stok: { $gt: 0 } }).lean();
    const riwayat = await Penjualan.find().populate('produk').sort({ tanggal: -1 }).lean();

    res.render('pelanggan/dashboard', {
      user: { nama: 'Pelanggan' },
      produkList,
      riwayat,
    });
  } catch (error) {
    console.error('Gagal menampilkan dashboard:', error);
    res.status(500).send('Gagal menampilkan halaman');
  }
};

exports.beli = async (req, res) => {
  try {
    const { produkId, jumlah } = req.body;
    const produk = await Produk.findById(produkId);

    if (!produk || produk.stok < jumlah) {
      return res.status(400).send('Stok tidak cukup atau produk tidak ditemukan');
    }

    const total = produk.harga * jumlah;

    await Penjualan.create({
      produk: produkId,
      jumlah,
      total,
      tanggal: new Date()
    });

    produk.stok -= jumlah;
    await produk.save();

    res.redirect('/user/dashboard');
  } catch (error) {
    console.error('Gagal membeli produk:', error);
    res.status(500).send('Terjadi kesalahan saat pembelian');
  }
};

exports.cetakLaporan = async (req, res) => {
  try {
    const riwayat = await Penjualan.find().populate('produk').sort({ tanggal: -1 }).lean();
    const templatePath = path.join(__dirname, '../views/pelanggan/laporan_pdf.ejs');

    ejs.renderFile(templatePath, { riwayat }, (err, html) => {
      if (err) {
        console.error('Render error:', err);
        return res.status(500).send('Gagal membuat PDF');
      }

      pdf.create(html, { format: 'A4' }).toStream((err, stream) => {
        if (err) {
          console.error('PDF error:', err);
          return res.status(500).send('Gagal mencetak PDF');
        }
        res.setHeader('Content-Type', 'application/pdf');
        stream.pipe(res);
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Kesalahan saat generate laporan');
  }
};

exports.hapusRiwayat = async (req, res) => {
  try {
    await Penjualan.deleteMany({});
    res.redirect('/user/dashboard');
  } catch (err) {
    console.error('Gagal menghapus riwayat pembelian:', err);
    res.status(500).send('Gagal menghapus riwayat pembelian');
  }
};
