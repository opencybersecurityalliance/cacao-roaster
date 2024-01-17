import { addressTypes } from '../../../model/SchemaTypes';
import { BasicInput } from '../BasicInput';
import { ListOfString } from '../ListInput/ListOfString';
import { DropDownInput } from './DropDownInput';

/**
 * The input to display and collect address property value.
 */
export class AddressInput extends BasicInput {
  _initialKey: string;
  _keyInput!: DropDownInput;
  _valueInput!: ListOfString;
  _displayFunction: any;

  constructor(
    inputName: string,
    initialKey: string,
    initialValue: any,
    displayFunction: any,
  ) {
    super(inputName, initialValue);
    this._initialKey = initialKey;
    this._displayFunction = displayFunction;
  }

  addToContainer(): void {
    let casesItem = document.createElement('div');
    casesItem.classList.add('cases-item');

    this._keyInput = new DropDownInput('case', this._initialKey, addressTypes);
    this._valueInput = new ListOfString(
      this._inputName,
      'string',
      casesItem,
      this._displayFunction,
    );
    this._valueInput.setDefaultValues(this._initialValue);

    this._keyInput.setContainer(casesItem);

    this._keyInput.addToContainer();
    this._valueInput.addToContainer();

    this._container?.appendChild(casesItem);
  }

  submit(): any {
    return { [this._keyInput.submit()]: this._valueInput.submit() };
  }
}
