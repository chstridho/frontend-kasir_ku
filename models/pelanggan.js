const mongoose = require('mongoose');

const pelangganSchema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    alamat: String,
    telepon: String,
});

module.exports = mongoose.model('Pelanggan', pelangganSchema);
