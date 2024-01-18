import {
  defaultType,
  schemaDictWithoutCommands,
} from '../../model/SchemaTypes';
import PlaybookHandler from '../../model/PlaybookHandler';
import { BasicInput } from './BasicInput';
import { DefinitionInput } from './BasicInputs/DefinitionInput';
import { ListInput } from './ListInput';

/**
 * The class which handles the definition properties.
 * The keys are displayed inside the list from the ListInput.
 */
export class DictionaryDefinition extends ListInput {
  _playbookHandler: PlaybookHandler;
  _definitionInput!: DefinitionInput;
  _callback: any;

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
    callback: any,
    displayFunction: any,
  ) {
    super(propertyName, propertyType, container, displayFunction);
    this._playbookHandler = playbookHandler;
    this._callback = callback;
    this.setDict();
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
      this._definitionInput.showPanel();
    };
  }

  createBasicInput(name: string, value: object): BasicInput {
    if (Object.entries(value).length != 0) {
      const [[key, val]] = Object.entries(value) as [[string, any]];
      if (val) {
        let defaultTypeValue: string = val.type;
        if (!schemaDictWithoutCommands[val.type]) {
          defaultTypeValue = defaultType[this._propertyType];
        }
        return (this._definitionInput = new DefinitionInput(
          name,
          value,
          this._playbookHandler,
          defaultTypeValue,
          this._callback,
        ));
      }
    }
    return (this._definitionInput = new DefinitionInput(
      name,
      value,
      this._playbookHandler,
      defaultType[this._propertyType],
      this._callback,
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
        list[result[0]] = result[1];
      }
    });
    return list;
  }
}
