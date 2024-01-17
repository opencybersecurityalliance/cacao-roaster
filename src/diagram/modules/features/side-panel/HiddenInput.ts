import { SingleInput } from './SingleInput';

/**
 * Input that is not displayed. It is meant to add properties in the json objects
 * without adding input fields inside of the property panels.
 */
export class HiddenInput extends SingleInput {
  addToContainer(): void {}

  submit(): any {
    return this._value;
  }
}
