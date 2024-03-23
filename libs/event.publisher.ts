import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { createEventName } from './constants';
import { OnEventHandlerReturnType } from './decorators';
import { EventHandleResultReducer } from './implements';
import { EventPublishOptions } from './interfaces';

@Injectable()
export class EventPublisher {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly debugging?: boolean,
  ) {}

  private readonly logger = new Logger(EventPublisher.name);

  private debug(eventName: string, originResults: OnEventHandlerReturnType[]) {
    if (!this.debugging) {
      return;
    }

    const staticInstanceRef = Logger['staticInstanceRef'];
    const results = originResults.map((result) => ({
      context: result.context.getClass()?.name,
      handler: result.context.getHandler()?.name,
      value: result.value,
      error: result.error ? { name: result.error.name, message: result.error.message, cause: result.error.cause } : null,
    }));

    if (staticInstanceRef instanceof ConsoleLogger) {
      this.logger.debug(JSON.stringify({ eventName, results }, null, 2));
    } else {
      this.logger.debug({ eventName, results });
    }
  }

  async publish<T = any>(event: T, opts: EventPublishOptions = {}) {
    const prototype = Object.getPrototypeOf(event);
    const eventName = createEventName(prototype.constructor.name);
    const results: OnEventHandlerReturnType[] = await this.eventEmitter.emitAsync(eventName, event, ...(opts?.args ?? []));

    this.debug(eventName, results);

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

    return new EventHandleResultReducer(eventName, results);
  }
}
