import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit number properties.
 */
export class NumberInput extends BasicInput {
  _inputField?: HTMLInputElement;

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'number';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    if (this._initialValue) {
      this._inputField.value = this._initialValue;
    }

    this._inputField.addEventListener('change', () => {
      this._updateFunction();
    });
    this._container?.appendChild(this._inputField);
  }

  submit(): any {
    if (this._inputField && this._inputField.value != '') {
      return Number(this._inputField.value);
    }
  }
}
