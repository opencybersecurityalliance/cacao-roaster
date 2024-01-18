import { BasicInput } from '../BasicInput';
import { TextFieldInput } from './TextFieldInput';

/**
 * The input to display and collect contact property value.
 */
export class ContactInfoInput extends BasicInput {
  _initialKey: string;
  _keyInput!: TextFieldInput;
  _valueInput!: TextFieldInput;

  constructor(inputName: string, initialKey: string, initialValue: any) {
    super(inputName, initialValue);
    this._initialKey = initialKey;
  }

  addToContainer(): void {
    let casesItem = document.createElement('div');
    casesItem.classList.add('list__contactitem');

    this._keyInput = new TextFieldInput('case', this._initialKey);
    this._keyInput.placeHolder = 'e.g., home';
    this._valueInput = new TextFieldInput('value', this._initialValue);
    this._valueInput.placeHolder = 'value';

    this._keyInput.setContainer(casesItem);
    this._valueInput.setContainer(casesItem);

    this._keyInput.addToContainer();
    this._valueInput.addToContainer();

    this._container?.appendChild(casesItem);
  }

  submit(): any {
    return { [this._keyInput.submit()]: this._valueInput.submit() };
  }
}
