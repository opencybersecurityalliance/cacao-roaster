import { BasicInput } from '../BasicInput';

/**
 * The input to display uneditable string properties.
 */
export class UneditableInput extends BasicInput {
  _inputField?: HTMLInputElement;

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'text';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    if (this._initialValue != null) {
      this._inputField.value = this._initialValue;
    }
    this._inputField.readOnly = true;
    this._inputField.disabled = true;

    this._container?.appendChild(this._inputField);
  }
  /*
    
    */

  /**
   * Sets the string to the uneditable input.
   * @param value string
   */
  setFieldValue(value: string) {
    this._inputField!.value = value;
  }

  submit(): any {
    return this._initialValue;
  }
}
