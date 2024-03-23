import { EventHandlerResultReducerGetValueOptions } from './types';
import { OnEventHandlerReturnType } from '../decorators';

export class EventHandleResultReducer {
  constructor(
    public readonly eventName: string,
    private readonly results: OnEventHandlerReturnType[],
  ) {}

  getValues(opts?: EventHandlerResultReducerGetValueOptions) {
    const values: any[] = [];

    for (const result of this.results) {
      if (result.value === undefined) {
        if (opts?.includeUndefined === true) {
          values.push(result.value);
        }

        continue;
      }

      if (result.value === null) {
        if (opts?.includeNull === true) {
          values.push(result.value);
        }

        continue;
      }

      values.push(result.value);
    }

    return values;
  }

  getFirstValue(opts?: EventHandlerResultReducerGetValueOptions) {
    return (
      this.results.find((result) => {
        if (result.error) {
          return false;
        }

        if (result.value === undefined) {
          return opts?.includeUndefined;
        }

        if (result.value === null) {
          return opts?.includeNull;
        }

        return true;
      })?.value ?? null
    );
  }

  getErrors() {
    const errors: Error[] = [];

    for (const result of this.results) {
      if (result.error instanceof Error) {
        errors.push(result.error);
      }
    }

    return errors;
  }

  getFirstError() {
    return this.results.find((result) => result.error instanceof Error)?.error ?? null;
  }

  getValueByClassName(classname: string) {
    return this.results.find((result) => result.context.getClass()?.name === classname)?.value ?? null;
  }

  getValueByHandlerName(handlername: string) {
    return this.results.find((result) => result.context.getHandler()?.name === handlername)?.value ?? null;
  }
}
