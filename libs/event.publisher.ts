import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { createEventName } from './constants';
import { OnEventHandlerReturnType } from './decorators';
import { EventHandleResultReducer } from './implements';
import { EventPublishOptions } from './interfaces';

@Injectable()
export class EventPublisher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish<T = any>(event: T, opts?: EventPublishOptions) {
    const prototype = Object.getPrototypeOf(event);
    const eventName = createEventName(prototype.constructor.name);
    const results: OnEventHandlerReturnType[] = await this.eventEmitter.emitAsync(eventName, event, ...(opts?.args ?? []));

    for (const result of results) {
      if (result.error === null) {
        continue;
      }

      if (opts.throwError === true) {
        throw result.error;
      } else {
        break;
      }
    }

    return new EventHandleResultReducer(results);
  }
}
