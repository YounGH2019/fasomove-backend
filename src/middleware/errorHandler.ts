import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API error:', err);

  const status = err.statusCode || 500;

  res.status(status).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
  });
};
