import { BasicInput } from '../BasicInput';
import { TextFieldInput } from '../BasicInputs/TextFieldInput';
import { ListInput } from '../ListInput';

/**
 * A ListOfString is a ListInput containing multiple TextFieldInputs.
 */
export class ListOfString extends ListInput {
  setDefaultValues(defaultValues: any): void {
    this._defaultValues = defaultValues;
  }

  createBasicInput(name: string, value: string): BasicInput {
    return new TextFieldInput(name, value);
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement('');
    };
  }
}
