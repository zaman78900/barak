import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(`Error: ${err.message} | Stack: ${err.stack}`);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details || err.message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Supabase/Database errors
  if (err.status === 409 || err.code === '23505') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.status === 404 || err.code === 'PGRST116') {
    return res.status(404).json({ error: 'Resource not found' });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
