import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit string properties in a text area.
 */
export class TextFieldInput extends BasicInput {
  _inputField: HTMLInputElement = document.createElement('input');

  addToContainer(): void {
    this._inputField.type = 'text';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    if (this._initialValue != null) {
      this._inputField.value = this._initialValue;
    }
    this._inputField.addEventListener('change', () => {
      this._updateFunction();
    });
    this._container?.appendChild(this._inputField);
  }

  set placeHolder(textHolder: string) {
    this._inputField.placeholder = textHolder;
  }

  submit(): any {
    if (this._inputField) {
      return this._inputField.value;
    }
  }
}
