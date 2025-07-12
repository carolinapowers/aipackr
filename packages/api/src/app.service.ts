import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string; version: string } {
    return {
      message: 'AIPackr API is running',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    };
  }
}