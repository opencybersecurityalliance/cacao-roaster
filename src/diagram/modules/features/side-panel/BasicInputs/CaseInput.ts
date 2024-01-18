import { BasicInput } from '../BasicInput';
import { TextFieldInput } from './TextFieldInput';
import { UneditableInput } from './UneditableInput';

/**
 * The input to display and edit cases property value from switch step.
 */
export class CaseInput extends BasicInput {
  _initialKey: string;
  _keyInput!: TextFieldInput;

  constructor(inputName: string, initialKey: string, initialValue: string) {
    super(inputName, initialValue);
    this._initialKey = initialKey;
  }

  addToContainer(): void {
    let casesItem = document.createElement('div');
    casesItem.classList.add('cases-item');

    this._keyInput = new TextFieldInput('case', this._initialKey);
    let valueInput = new UneditableInput('value', this._initialValue);

    this._keyInput.setContainer(casesItem);
    valueInput.setContainer(casesItem);

    this._keyInput.addToContainer();
    valueInput.addToContainer();
    this._keyInput.setUpdate(this._updateFunction);

    this._container?.appendChild(casesItem);
  }

  submit(): any {
    return { [this._keyInput.submit()]: this._initialValue };
  }
}
