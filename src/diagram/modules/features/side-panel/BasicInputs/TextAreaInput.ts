import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit string properties.
 */
export class TextAreaInput extends BasicInput {
  _inputField?: HTMLTextAreaElement;

  addToContainer(): void {
    this._inputField = document.createElement('textarea');
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    this._inputField.classList.add('container--textarea');

    if (this._initialValue != null) {
      this._inputField.value = this._initialValue;
    }
    this._inputField.addEventListener('change', () => {
      this._updateFunction();
    });

    this._container?.appendChild(this._inputField);
  }

  submit(): any {
    if (this._inputField) {
      return this._inputField.value;
    }
  }
}
