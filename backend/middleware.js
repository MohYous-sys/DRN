function login_required(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
}

function admin_required(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  } else {
    return res.status(403).json({ error: 'Forbidden. Administrator access required.' });
  }
}

module.exports = { login_required, admin_required };
