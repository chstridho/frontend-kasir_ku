const Produk = require('../models/produk');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const ExcelJS = require('exceljs');

exports.index = async (req, res) => {
    try {
        const produkList = await Produk.find().lean();
        res.render('admin/laporan', { produkList });
    } catch (err) {
        console.error('Gagal memuat laporan:', err);
        res.status(500).send('Gagal memuat halaman laporan');
    }
};

exports.generatePDF = async (req, res) => {
    try {
        const produkList = await Produk.find().lean();

        const doc = new PDFDocument({ margin: 50 });
        const filename = `laporan_produk_${Date.now()}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Header
        doc.fontSize(20).text('📦 Laporan Produk', { align: 'center' });
        doc.fontSize(12).text(`Generated at: ${moment().format('DD/MM/YYYY HH:mm')}`, { align: 'center' });
        doc.moveDown();

        // Table Header Background
        doc.rect(50, doc.y, 500, 20).fill('#f0f0f0');
        doc.fillColor('#000');

        // Table Header Text
        doc.font('Courier-Bold').fontSize(12);
        doc.text('Nama Produk', 55, doc.y + 4, { continued: true });
        doc.text('Harga', 255, doc.y, { width: 100, align: 'right', continued: true });
        doc.text('Stok', 405, doc.y, { width: 50, align: 'center' });
        doc.moveDown();

        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

        // Table Rows
        doc.font('Courier').fontSize(11).moveDown(0.5);
        produkList.forEach((p) => {
            doc.text(p.nama, 55, doc.y, { width: 200, continued: true });
            doc.text(`Rp ${p.harga.toLocaleString('id-ID')}`, 255, doc.y, { width: 100, align: 'right', continued: true });
            doc.text(p.stok.toString(), 405, doc.y, { width: 50, align: 'center' });
            doc.moveDown(0.5);
        });

        // Footer
        doc.moveDown(2);
        doc.fontSize(10).fillColor('gray').text('KasirKu © ' + new Date().getFullYear(), { align: 'center' });

        doc.end();
    } catch (err) {
        console.error('Gagal generate PDF:', err);
        res.status(500).send('Gagal generate PDF');
    }
};

exports.exportExcel = async (req, res) => {
    try {
      const produkList = await Penjualan.find().populate('produk').sort({ tanggal: -1 }).lean();
  
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
      produkList.forEach((p) => {
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