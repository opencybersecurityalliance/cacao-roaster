import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit enum properties which need a drop down.
 * A listener is set to enable a function when the value changes.
 */
export class EnumListenedInput extends BasicInput {
  _input!: HTMLInputElement;
  _options: string[];
  //The function called when the value changes.
  _callback: any;

  constructor(
    inputName: string,
    initialValue: any,
    options: any,
    callback: any,
  ) {
    super(inputName, initialValue);
    this._options = options;
    this._callback = callback;
  }

  /**
   * Sets the list of options that will appear in the drop down.
   * @param options string[]
   */
  setOptions(options: any) {
    this._options = options;
  }

  addToContainer(): void {
    let select: HTMLSelectElement = document.createElement('select');
    this._input = document.createElement('input');
    this._input.type = 'hidden';
    this._input.name = this._inputName;
    this._input.style.display = 'none';
    select.classList.add('property__container');
    select.classList.add('container--simple');

    //Adds every option inside the select element.
    for (var element of this._options) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = element;
      option.text = element;
      select.appendChild(option);
      if (element == this._initialValue) {
        select.value = element;
        this._input.value = select.value;
      }
    }

    //Sets up the refresh function.
    select.addEventListener('change', () => {
      if (select.value != '') {
        this._input.value = select.value;
        this._updateFunction();
        this._callback(this._input.value);
      }
    });

    this._input.value = select.value;
    this._container?.appendChild(select);
    this._container?.appendChild(this._input);
  }

  submit(): any {
    if (this._input) {
      return this._input.value;
    }
  }
}
