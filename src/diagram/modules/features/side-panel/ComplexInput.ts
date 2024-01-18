import { PanelInput } from './PanelInput';

/**
 * ComplexInput are PanelInput with multiple inputs
 */
export abstract class ComplexInput extends PanelInput {
  _defaultValues: any;
  _propertyType: string;
  _description: string = '';

  constructor(
    propertyName: string,
    propertyType: string,
    container: HTMLElement,
  ) {
    super(propertyName, container);
    this._propertyType = propertyType;
  }

  /**
   * Sets the description that will be used in the labels.
   * @param description string
   */
  setDescription(description: string) {
    this._description = description;
  }

  /**
   * Sets the default values for each input inside the ComplexInput.
   * @param defaultValues
   */
  abstract setDefaultValues(defaultValues: any): void;
}
