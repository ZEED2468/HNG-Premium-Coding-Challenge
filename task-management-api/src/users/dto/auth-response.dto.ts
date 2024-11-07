export class AuthResponseDto {
    statusCode: number;
    message: string;
    data: {
      user: {
        id: string;
        username: string;
        email: string;
        createdAt: string;
      };
      accessToken: string;
    };
  }
  