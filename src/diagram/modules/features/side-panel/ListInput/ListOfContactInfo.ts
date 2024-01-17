import { BasicInput } from '../BasicInput';
import { ContactInfoInput } from '../BasicInputs/ContactInfoInput';
import { ListInput } from '../ListInput';

/**
 * A ListOfContactInfo is a ListInput containing multiple ContactInfoInput.
 */
export class ListOfContactInfo extends ListInput {
  setDefaultValues(defaultValues: any): void {
    if (defaultValues) {
      Object.entries(defaultValues).forEach((element: any) => {
        this._defaultValues.push(element);
      });
    }
  }

  createBasicInput(name: string, value: string): BasicInput {
    return new ContactInfoInput(name, value[0], value[1]);
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
    };
  }

  submit(): object {
    let list = {};
    this._elements.forEach(element => {
      if (element.submit()) {
        Object.assign(list, element.submit());
      }
    });
    return list;
  }
}
