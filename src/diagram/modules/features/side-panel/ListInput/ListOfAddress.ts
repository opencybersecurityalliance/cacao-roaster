import { BasicInput } from '../BasicInput';
import { AddressInput } from '../BasicInputs/AddressInput';
import { ListInput } from '../ListInput';

/**
 * A ListOfAddress is a ListInput containing multiple AddressInput.
 */
export class ListOfAddress extends ListInput {
  constructor(
    propertyName: string,
    propertyType: string,
    container: HTMLElement,
    displayFunction: any,
  ) {
    super(propertyName, propertyType, container, displayFunction);
    this.setDict();
  }

  setDefaultValues(defaultValues: any): void {
    if (defaultValues) {
      Object.entries(defaultValues).forEach((element: any) => {
        this._defaultValues.push(element);
      });
    }
  }

  createBasicInput(name: string, value: string): BasicInput {
    return new AddressInput(name, value[0], value[1], this._displayFunction);
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
