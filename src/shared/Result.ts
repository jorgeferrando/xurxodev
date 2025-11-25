/**
 * Result monad for error handling without exceptions
 * Represents either a success with a value or a failure with an error
 */

export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value, undefined);
  }

  static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  isSuccess(): boolean {
    return this._isSuccess;
  }

  isFailure(): boolean {
    return !this._isSuccess;
  }

  getValue(): T {
    if (!this._isSuccess) {
      throw new Error("Cannot get value from a failed result");
    }
    return this._value!;
  }

  getError(): string {
    if (this._isSuccess) {
      throw new Error("Cannot get error from a successful result");
    }
    return this._error!;
  }
}
