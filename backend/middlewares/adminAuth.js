// Middleware for admin authentication
export const adminAuth = (req, res, next) => {
  console.log(req.session.user)
    if (req.session.user) {
      // res.status(403).json({ message: 'Access Granted' });
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  };