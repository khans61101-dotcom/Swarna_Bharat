const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  // Token format usually "Bearer <token>"
  const tokenPart = token.split(' ')[1] || token;

  jwt.verify(tokenPart, process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized!' });
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin') {
    return res.status(403).json({ error: 'Require Admin Role!' });
  }
  next();
};

const isAgentOrAdmin = (req, res, next) => {
  if (req.userRole !== 'Admin' && req.userRole !== 'Agency' && req.userRole !== 'NGO' && req.userRole !== 'Agent') {
    return res.status(403).json({ error: 'Require Admin, Agency, or NGO Role!' });
  }
  next();
};

const isAgencyOrNgoOrAdmin = isAgentOrAdmin;

module.exports = {
  verifyToken,
  isAdmin,
  isAgentOrAdmin,
  isAgencyOrNgoOrAdmin
};

