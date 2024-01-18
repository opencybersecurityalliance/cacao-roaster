import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { ListInput } from '../ListInput';
import { ObjectInput } from '../BasicInputs/ObjectInput';

/**
 * A ListOfObject is a ListInput containing multiple ObjectInputs.
 */
export class ListOfObject extends ListInput {
  _playbookHandler: PlaybookHandler;
  _objectInput!: ObjectInput;

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
    displayFunction: any,
  ) {
    super(propertyName, propertyType, container, displayFunction);
    this._playbookHandler = playbookHandler;
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
      this._objectInput.setUpdate(this._updateFunction);
      this._objectInput.showPanel();
    };
  }

  setDefaultValues(defaultValues: any): void {
    if (defaultValues) {
      Object.values(defaultValues).forEach((element: any) => {
        this._defaultValues.push(element);
      });
    }
  }

  addContainerCSSClass(className: string) {
    this._bodyListContainer.classList.add(className);
  }

  createBasicInput(name: string, value: string): BasicInput {
    return (this._objectInput = new ObjectInput(
      name,
      value,
      this._playbookHandler,
      this._propertyType,
    ));
  }
}
