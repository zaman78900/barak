import { verifyToken } from '../utils/auth.js';
import logger from '../utils/logger.js';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`[Auth] Invalid/missing auth header for ${req.method} ${req.path}`);
      logger.debug(`[Auth] Received headers:`, {
        hasAuth: !!authHeader,
        authValue: authHeader ? `${authHeader.substring(0, 20)}...` : 'none',
        allHeaders: Object.keys(req.headers),
      });
      
      return res.status(401).json({ 
        error: 'Missing or invalid token',
        details: 'Authorization header required with Bearer token format'
      });
    }

    const token = authHeader.slice(7);
    logger.debug(`[Auth] Attempting to verify token: ${token.substring(0, 20)}...`);
    
    const decoded = verifyToken(token);

    if (!decoded) {
      logger.warn(`[Auth] Token verification failed for: ${token.substring(0, 20)}...`);
      return res.status(401).json({ 
        error: 'Invalid token',
        details: 'Token verification failed. Please login again.'
      });
    }

    logger.info(`[Auth✓] User authenticated: ${decoded.userId || decoded.email}`);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`[Auth] Middleware error: ${error.message}`);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error.message 
    });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn(`[Authorize] No user in request for ${req.path}`);
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      logger.warn(`[Authorize] User ${req.user.email} (role: ${req.user.role}) lacks required role(s): ${roles.join(', ')}`);
      return res.status(403).json({ 
        error: 'Forbidden: Insufficient permissions',
        userRole: req.user.role,
        requiredRoles: roles
      });
    }

    logger.debug(`[Authorize✓] User ${req.user.email} authorized`);
    next();
  };
};

export { authenticate, authorize };
