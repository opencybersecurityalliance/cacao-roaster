import { commonTypeDict } from '../../../../modules/model/SchemaTypes';
import { BasicInput } from '../BasicInput';
import { v4 as uuidv4 } from 'uuid';

/**
 * The input to display and edit open vocab properties which need a open drop down.
 * A listener is set to enable a function when the value changes.
 */
export class OvListenedInput extends BasicInput {
  _input!: HTMLInputElement;
  _options: any;
  _callback: any;
  _parentType: string;

  constructor(
    inputName: string,
    initialValue: any,
    options: any,
    callback: any,
    parentType: string,
  ) {
    super(inputName, initialValue);
    this._options = options;
    this._callback = callback;
    this._parentType = parentType;
  }

  /**
   * Sets the list of options that will appear in the drop down.
   * @param options string[]
   */
  setOptions(options: any) {
    this._options = options;
  }

  addToContainer(): void {
    this._input = document.createElement('input');
    this._input.name = this._inputName;
    this._input.classList.add('property__container');

    let datalist: HTMLDataListElement = document.createElement('datalist');
    datalist.id = this._inputName + uuidv4();

    for (let element of this._options) {
      let option: HTMLOptionElement = document.createElement('option');
      option.value = element;
      datalist.appendChild(option);
    }

    this._input.setAttribute('list', datalist.id);
    if (this._initialValue) {
      //set the value form the model
      this._input.value = this._initialValue;
    }

    this._container?.appendChild(this._input);
    this._container?.appendChild(datalist);

    this._input.addEventListener('change', () => {
      if (this._options.includes(this._input.value)) {
        this._callback(this._input.value);
      } else {
        this._callback(commonTypeDict[this._parentType]);
      }
    });
  }

  submit(): any {
    if (this._input) {
      return this._input.value;
    }
  }
}
