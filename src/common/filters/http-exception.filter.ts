import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    let message = exceptionResponse?.message;
    if (typeof message === 'object') {      
      message = message[0].constraint;
    }    
    response
      .status(status)
      .json(
        {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          error: message
        }
      )
  }
}
