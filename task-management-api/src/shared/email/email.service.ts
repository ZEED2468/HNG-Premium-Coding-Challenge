import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // Simulate sending email
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
  }
}
