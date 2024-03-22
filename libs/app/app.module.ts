import { Module, OnApplicationBootstrap } from '@nestjs/common';

import { AppController } from './app.controller';
import { HelloEvent } from './events/hello.event';
import { EventModule } from '../event.module';
import { EventPublisher } from '../event.publisher';

@Module({
  imports: [EventModule.register()],
  controllers: [AppController],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly eventPublisher: EventPublisher) {}

  async onApplicationBootstrap() {
    const results = await this.eventPublisher.publish(new HelloEvent());
    console.log(results.getFirstValue());
  }
}
