import { DynamicModule, Module, Provider } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { EventPublisher } from './event.publisher';
import { EventModuleOptions } from './interfaces';

@Module({})
export class EventModule {
  static register(moduleOptions?: EventModuleOptions): DynamicModule {
    const publisher: Provider = {
      inject: [EventEmitter2],
      provide: EventPublisher,
      useFactory(eventEmitter: EventEmitter2) {
        return new EventPublisher(eventEmitter, moduleOptions?.debugging);
      },
    };

    return {
      module: EventModule,
      global: moduleOptions?.global,
      imports: [EventEmitterModule.forRoot({ global: false })],
      providers: [publisher],
      exports: [publisher],
    };
  }
}
