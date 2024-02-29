import { BasicInput } from '../BasicInput';
import { ListOfString } from '../ListInput/ListOfString';
import { TextFieldInput } from './TextFieldInput';

/**
 * The input to display and collect address property value.
 */
export class HttpHeaderInput extends BasicInput {
  _initialKey: string;
  _keyInput!: TextFieldInput;
  _valueInput!: ListOfString;
  _displayFunction: any;

  constructor(inputName: string, initialKey: string, initialValue: any, displayFunction: any) {
    super(inputName, initialValue);
    this._initialKey = initialKey;
    this._displayFunction = displayFunction;
  }

  addToContainer(): void {
    let headerItem = document.createElement('div');
    headerItem.classList.add('cases-item');

    this._keyInput = new TextFieldInput('header', this._initialKey);
    this._valueInput = new ListOfString(
      this._inputName,
      'string',
      headerItem,
      this._displayFunction,
    );
    this._valueInput.setDefaultValues(this._initialValue);

    this._keyInput.setContainer(headerItem);

    this._keyInput.addToContainer();
    this._valueInput.addToContainer();

    this._container?.appendChild(headerItem);
  }

  submit(): any {
    return { [this._keyInput.submit()]: this._valueInput.submit() };
  }
}
