import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit enum properties which need a drop down.
 */
export class DropDownInput extends BasicInput {
  _input!: HTMLInputElement;
  _select!: HTMLSelectElement;
  _options: string[];
  _canBeBlank: boolean;

  constructor(
    inputName: string,
    initialValue: string,
    options: string[],
    canBeBlank = true,
  ) {
    super(inputName, initialValue);
    this._options = options;
    this._canBeBlank = canBeBlank;

    this._select = document.createElement('select');
    this._input = document.createElement('input');
  }

  /**
   * Sets the list of options that will appear in the drop down.
   * @param options string[]
   */
  setOptions(options: string[]) {
    this._options = options;
  }

  setCSSClass(className: string) {
    this._select.classList.add(className);
  }

  addToContainer(): void {
    this._input.type = 'hidden';
    this._input.name = this._inputName;
    this._input.style.display = 'none';
    this._select.classList.add('property__container');
    this._select.classList.add('container--simple');

    if (this._canBeBlank) {
      let blankOption: HTMLOptionElement = document.createElement('option');
      blankOption.value = '';
      blankOption.text = '';
      this._select.appendChild(blankOption);
    }

    //Adds every option inside the select element.
    for (var element of this._options) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = element;
      option.text = element;
      this._select.appendChild(option);
      if (element == this._initialValue) {
        this._select.value = element;
        this._input.value = this._select.value;
      }
    }

    this._select.addEventListener('change', () => {
      this._input.value = this._select.value;
    });
    if (!this._canBeBlank) {
      this._input.value = this._select.value;
    }

    this._container?.appendChild(this._select);
    this._container?.appendChild(this._input);
  }

  submit(): any {
    if (this._input) {
      return this._input.value;
    }
  }
}
