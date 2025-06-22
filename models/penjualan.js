// models/penjualan.js
const mongoose = require('mongoose');
const penjualanSchema = new mongoose.Schema({
  produk: { type: mongoose.Schema.Types.ObjectId, ref: 'Produk' },
  jumlah: Number,
  total: Number,
  tanggal: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Penjualan', penjualanSchema);
