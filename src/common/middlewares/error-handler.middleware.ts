import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ErrorHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
     
      next();
    } catch (error) {
     
      this.handleError(error, res);
    }
  }

  private handleError(error: any, res: Response) {
  
    console.error('An error occurred:', error);

    if (error.status && error.message) {
      res.status(error.status).json({
        statusCode: error.status,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
