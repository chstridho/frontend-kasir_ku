const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const produkRoutes = require('./routes/produkRoutes');
const stokRoutes = require('./routes/stokRoutes'); 
const penjualanRoutes = require('./routes/penjualanRoutes');
const laporanRoutes = require('./routes/laporanRoutes');
const userRoutes = require('./routes/userRoutes');// ✅ IMPORT
const cookieParser = require('cookie-parser');
const setCurrentPage = require('./middlewares/setCurrentPage');


const app = express();

// CONFIG
dotenv.config();            
connectDB();                

// PARSER
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(setCurrentPage);

// STATIC & VIEW
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// ROUTES
// ROUTES
app.use(authRoutes);
app.use(produkRoutes);
app.use('/stok', stokRoutes);          // ✅ PERBAIKAN DI SINI
app.use('/laporan', laporanRoutes);
app.use('/penjualan', penjualanRoutes);
app.use('/user', userRoutes);

// ✅ PERBAIKAN: tambahkan prefix '/stok'

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
