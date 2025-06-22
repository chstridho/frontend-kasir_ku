exports.redirectByRole = (req, res, next) => {
  const email = req.user?.email || req.body.email;
  if (!email) return res.redirect('/login');

  if (email.includes('admin') || email.includes('petugas')) {
    return res.redirect('/produk');
  }
  return res.redirect('/user/dashboard');
};
