import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit boolean properties.
 */
export class RadioBoxInput extends BasicInput {
  _inputField!: HTMLInputElement;

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'radio';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('propertiesElements');
    if (this._initialValue != null) {
      this._inputField.checked = this._initialValue;
    }
    this._inputField.addEventListener('click', event => {
      // Prevents clicking on its parent
      event.stopPropagation();
    });

    this._container?.appendChild(this._inputField);
  }

  submit(): any {
    return this._inputField.checked;
  }
}
