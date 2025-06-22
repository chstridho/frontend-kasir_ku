const Penjualan = require('../models/penjualan');
const Produk = require('../models/produk');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const ExcelJS = require('exceljs');
require('moment/locale/id'); // Untuk lokal Indonesia



exports.index = async (req, res) => {
  try {
    const produkList = await Produk.find().lean();
    const penjualanList = await Penjualan.find()
      .populate('produk')
      .sort({ tanggal: -1 })
      .lean();

    res.render('admin/penjualan', {
      produkList,
      penjualanList,
      currentPage: 'penjualan' // ✅ Diperlukan untuk sidebar aktif
    });
  } catch (err) {
    console.error('Gagal menampilkan penjualan:', err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.hapusSemua = async (req, res) => {
  try {
    await Penjualan.deleteMany({});
    res.redirect('/penjualan');
  } catch (err) {
    console.error('Gagal menghapus penjualan:', err);
    res.status(500).send('Gagal menghapus');
  }
};

exports.cetakPDF = async (req, res) => {
  try {
    const penjualanList = await Penjualan.find().populate('produk').sort({ tanggal: -1 }).lean();

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-disposition', 'inline; filename="riwayat-penjualan.pdf"');
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Header
    doc.fontSize(18).text('KasirKu - Riwayat Penjualan', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Tanggal Cetak: ${moment().locale('id').format('LLL')}`, { align: 'right' });
    doc.moveDown(1);

    // Table Header
    doc.fontSize(12);
    const tableTop = doc.y;
    const itemSpacing = 20;

    const headers = ['Tanggal', 'Produk', 'Jumlah', 'Total', 'Pelanggan'];
    const columnWidths = [120, 150, 60, 80, 100];
    let x = 50;

    headers.forEach((header, i) => {
      doc.font('Helvetica-Bold').text(header, x, tableTop, { width: columnWidths[i] });
      x += columnWidths[i];
    });

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // Table Rows
    penjualanList.forEach((p) => {
      const tanggal = moment(p.tanggal).locale('id').format('DD MMM YYYY HH:mm');
      const namaProduk = p.produk?.nama || 'Tidak tersedia';
      const jumlah = p.jumlah;
      const total = `Rp ${p.total.toLocaleString('id-ID')}`;
      const pelanggan = p.pelanggan || '-';

      const row = [tanggal, namaProduk, jumlah.toString(), total, pelanggan];
      let x = 50;
      const y = doc.y + 5;

      row.forEach((cell, i) => {
        doc.font('Helvetica').text(cell, x, y, { width: columnWidths[i] });
        x += columnWidths[i];
      });

      doc.moveDown(1);
    });

    doc.end();
  } catch (err) {
    console.error('Gagal generate PDF:', err);
    res.status(500).send('Gagal membuat PDF');
  }
};



exports.exportExcel = async (req, res) => {
  try {
    const penjualanList = await Penjualan.find().populate('produk').sort({ tanggal: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Riwayat Penjualan');

    // Header Kolom
    worksheet.columns = [
      { header: 'Tanggal', key: 'tanggal', width: 20 },
      { header: 'Produk', key: 'produk', width: 30 },
      { header: 'Jumlah', key: 'jumlah', width: 10 },
      { header: 'Total (Rp)', key: 'total', width: 20 },
    ];

    // Tambahkan baris dari data penjualan
    penjualanList.forEach((p) => {
      worksheet.addRow({
        tanggal: moment(p.tanggal).format('DD-MM-YYYY HH:mm'),
        produk: p.produk?.nama || 'Produk tidak tersedia',
        jumlah: p.jumlah,
        total: p.total,
      });
    });

    // Format header tebal
    worksheet.getRow(1).font = { bold: true };

    // Kirim sebagai file Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=riwayat_penjualan.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Gagal export Excel:', err);
    res.status(500).send('Gagal export Excel');
  }
};
