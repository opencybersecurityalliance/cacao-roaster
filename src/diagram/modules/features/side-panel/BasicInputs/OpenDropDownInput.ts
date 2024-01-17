import { BasicInput } from '../BasicInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * The input to display and edit open vocabulary properties which need a open drop down.
 */
export class OpenDropDownInput extends BasicInput {
  _input!: HTMLInputElement;
  _datalist: HTMLDataListElement = document.createElement('datalist');
  _options: any;

  constructor(inputName: string, initialValue: any, options: any) {
    super(inputName, initialValue);
    this._options = options;
    this._input = document.createElement('input');
  }

  /**
   * Sets the list of options that will appear in the drop down.
   * @param options string[]
   */
  setOptions(options: any) {
    this._options = options;
  }

  /**
   * Sets function to give the current value to te panel.
   * @param callback function: to give the current value.
   * @param index number: the index to store the object value
   */
  setListener(callback: any, index: number) {
    callback(this._input.value, index);
    this._input.addEventListener('change', () => {
      callback(this._input.value, index);
    });
  }

  addToContainer(): void {
    this._input.name = this._inputName;
    this._input.classList.add('property__container');
    this._input.classList.add('container--simple');

    this._datalist.id = this._inputName + uuidv4();

    this.reloadOption();

    this._input.setAttribute('list', this._datalist.id);
    if (this._initialValue) {
      //set the value form the model
      this._input.value = this._initialValue;
    }

    this._container?.appendChild(this._input);
    this._container?.appendChild(this._datalist);
  }

  /**
   * Loads the datalist options.
   */
  reloadOption() {
    this._datalist.innerHTML = '';
    for (let element of this._options) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = element;
      this._datalist.appendChild(option);
    }
  }

  submit(): any {
    if (this._input) {
      return this._input.value;
    }
  }
}
