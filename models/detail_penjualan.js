const mongoose = require('mongoose');

const detailPenjualanSchema = new mongoose.Schema({
    penjualan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Penjualan',
        required: true,
    },
    produk: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produk',
        required: true,
    },
    jumlah: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('DetailPenjualan', detailPenjualanSchema);
