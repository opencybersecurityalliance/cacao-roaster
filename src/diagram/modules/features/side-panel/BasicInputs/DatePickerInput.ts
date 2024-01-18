import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit timestamp properties.
 */
export class DatePickerInput extends BasicInput {
  _inputField?: HTMLInputElement;

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'datetime-local';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('property__container');
    this._inputField.classList.add('container--simple');
    if (this._initialValue) {
      const utcDate = new Date(this._initialValue);
      if (!isNaN(utcDate.getDate())) {
        const timezoneOffset = utcDate.getTimezoneOffset();
        const localDate = new Date(utcDate.getTime() - timezoneOffset * 60000);
        this._inputField.value = localDate.toISOString().replace('Z', '');
      }
    }

    this._container?.appendChild(this._inputField);
  }

  submit(): any {
    if (this._inputField) {
      if (!isNaN(new Date(this._inputField.value).getTime())) {
        return new Date(this._inputField.value).toISOString();
      }
      return '';
    }
  }
}
