import { DynamicModule, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EventPublisher } from './event.publisher';
import { EventModuleOptions } from './interfaces';

@Module({})
export class EventModule {
  static register(moduleOptions?: EventModuleOptions): DynamicModule {
    return {
      module: EventModule,
      global: moduleOptions?.global,
      imports: [EventEmitterModule.forRoot({ global: false })],
      providers: [EventPublisher],
      exports: [EventPublisher],
    };
  }
}
