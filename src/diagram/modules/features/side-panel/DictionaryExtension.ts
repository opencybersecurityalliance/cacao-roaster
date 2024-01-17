import PlaybookHandler from '../../model/PlaybookHandler';
import { BasicInput } from './BasicInput';
import { ListInput } from './ListInput';
import { ExtensionInput } from './BasicInputs/ExtensionInput';

/**
 * The class which handles the extension properties.
 * The keys are displayed inside the list from the ListInput.
 */

export class DictionaryExtension extends ListInput {
  _playbookHandler: PlaybookHandler;
  _extensionInput!: ExtensionInput;
  _options: any;

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
    options: any,
    displayFunction: any,
  ) {
    super(propertyName, propertyType, container, displayFunction);
    this._playbookHandler = playbookHandler;
    this._options = options;
    this.setDict();
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
    };
  }

  createBasicInput(name: string, value: object): BasicInput {
    return (this._extensionInput = new ExtensionInput(
      name,
      value,
      this._playbookHandler,
      this._propertyType,
      this._options,
    ));
  }

  setDefaultValues(defaultValues: any): void {
    for (const element in defaultValues) {
      this._defaultValues.push({ [element]: defaultValues[element] });
    }
  }

  submit() {
    let list: any = {};
    this._elements.forEach(element => {
      let result = element.submit();
      if (result) {
        list[Object.keys(result)[0]] = Object.values(result)[0];
      }
    });
    return list;
  }
}
