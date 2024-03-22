import { Type } from '@nestjs/common';

export type OnEventContextType = {
  getClass(): Type<any> | null;
  getHandler(): Type<any> | null;
};

export type OnEventHandlerReturnType<T = any> = {
  context: OnEventContextType;
} & (
  | {
      value: T;
      error: null;
    }
  | {
      value: null;
      error: Error;
    }
);
