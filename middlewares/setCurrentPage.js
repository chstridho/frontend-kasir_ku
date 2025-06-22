// middleware/setCurrentPage.js
module.exports = (req, res, next) => {
  const path = req.path.split('/')[1]; // Ambil segmen pertama dari URL path
  res.locals.currentPage = path;
  next();
};
