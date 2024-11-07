export function formatResponse<T>(
    statusCode: number,
    message: string,
    data?: T
  ): { statusCode: number; message: string; data: T } {
    return {
      statusCode,
      message,
      data,
    };
  }
  