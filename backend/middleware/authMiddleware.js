const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'secret';

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
