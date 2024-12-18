import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(response: string | Record<string, any>, status: HttpStatus) {
    super(response, status);
  }

  getResponse(): any {
    const response = super.getResponse();
    const statusCode = this.getStatus();

    if (typeof response === 'object' && response !== null) {
      const res = response as Record<string, any>;
      return {
        message: res.message || 'An error occurred',
        statusCode,
      };
    }

    return {
      message: response,
      statusCode,
    };
  }
}
