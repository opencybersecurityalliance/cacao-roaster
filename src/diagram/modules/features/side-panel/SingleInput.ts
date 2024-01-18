import { BasicInput } from './BasicInput';
import { PanelInput } from './PanelInput';

/**
 * SingleInputs are PanelInputs with only a single field.
 */
export abstract class SingleInput extends PanelInput {
  _basicInput?: BasicInput;

  _value: any = '';

  constructor(propertyName: string, container: HTMLElement) {
    super(propertyName, container);
  }

  /**
   * Sets the basic input to be displayed.
   */
  setBasicInput(basicInput: BasicInput) {
    this._basicInput = basicInput;
  }

  /**
   * Sets the value which is used and display by default.
   * @param value
   */
  setValue(value: any) {
    this._value = value;
  }

  /**
   *
   * @returns string: the property name
   */
  name(): string {
    return this._propertyName;
  }
}
