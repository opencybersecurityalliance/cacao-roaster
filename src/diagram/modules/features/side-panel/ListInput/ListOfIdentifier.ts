import { BasicInput } from '../BasicInput';
import { DropDownInput } from '../BasicInputs/DropDownInput';
import { ListInput } from '../ListInput';

/**
 * A ListOfIdentifier is a ListInput containing multiple DropDownInput.
 */
export class ListOfIdentifier extends ListInput {
  _optionsList!: string[];

  /**
   * Sets the list of options that will appear in the drop down.
   * @param options string[]
   */
  setOptions(options: string[]) {
    this._optionsList = options;
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement('');
    };
  }

  setDefaultValues(defaultValues: any): void {
    if (defaultValues) {
      Object.values(defaultValues).forEach((element: any) => {
        this._defaultValues.push(element);
      });
    }
  }

  createBasicInput(name: string, value: string): BasicInput {
    return new DropDownInput(name, value, this._optionsList);
  }
}
