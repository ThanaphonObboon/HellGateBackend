import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      Message: 'Hello Node js web api',
    };
  }
}
