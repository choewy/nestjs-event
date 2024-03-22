import { Controller } from '@nestjs/common';

import { HelloEvent } from './events/hello.event';
import { OnEvent } from '../decorators';

@Controller()
export class AppController {
  @OnEvent(HelloEvent)
  async handleHelloEvent(event: HelloEvent) {
    console.log(event);
  }
}
