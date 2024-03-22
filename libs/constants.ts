import { Type } from '@nestjs/common';

export const createEventName = (event: Type<any> | string) => {
  const eventName = ['@choewy_nest_event', 'event'];

  if (typeof event === 'string') {
    eventName.push(event);
  } else {
    eventName.push(event.name);
  }

  return eventName.join('.');
};
