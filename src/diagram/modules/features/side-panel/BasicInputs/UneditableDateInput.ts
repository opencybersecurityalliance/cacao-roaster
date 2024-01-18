import { BasicInput } from '../BasicInput';

/**
 * The input to display uneditable string properties.
 */
export class UneditableDateInput extends BasicInput {
  _inputField?: HTMLInputElement;

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'text';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    let date = new Date(this._initialValue);
    if (!isNaN(date.getTime())) {
      this._inputField.value = date.toLocaleString();
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
