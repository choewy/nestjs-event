import { applyDecorators, Type } from '@nestjs/common';
import { OnEvent as EventEmitterOnEvent } from '@nestjs/event-emitter';

import { OnEventContextType, OnEventHandlerReturnType } from './types';
import { createEventName } from '../constants';

export const OnEvent = (event: Type<any>) => {
  const eventName = createEventName(event);
  console.log(eventName);

  return applyDecorators(
    EventEmitterOnEvent(eventName),
    (_target: unknown, _propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const handler = descriptor.value;
      const metadataKeys = Reflect.getOwnMetadataKeys(descriptor.value);
      const metadataValues = metadataKeys.map((key) => {
        return [key, Reflect.getMetadata(key, descriptor.value)];
      });

      descriptor.value = async function (...args: any[]) {
        const context: OnEventContextType = {
          getClass: () => this.constructor,
          getHandler: () => handler,
        };

        const returnValue: OnEventHandlerReturnType = {
          context,
          error: null,
          value: null,
        };

        try {
          returnValue.value = await handler.bind(this)(...args);
        } catch (e) {
          returnValue.error = e;
        }

        return returnValue;
      };

      metadataValues.forEach(([key, value]) => Reflect.defineMetadata(key, value, descriptor.value));
    },
  );
};
