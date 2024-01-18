import PlaybookHandler from '../../model/PlaybookHandler';
import { BasicInput } from './BasicInput';
import { StepVariableInput } from './BasicInputs/StepVariableInput';
import { ListInput } from './ListInput';

/**
 * The class which handles the variable properties (step variable and playbook variable).
 * The keys are displayed inside the list from the ListInput, which are the variable names.
 */

export class DictionaryVariable extends ListInput {
  _playbookHandler: PlaybookHandler;
  _refreshFunction: any;
  _objectInput!: StepVariableInput;

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
    displayFunction: any,
    refreshFunction: any,
  ) {
    super(propertyName, propertyType, container, displayFunction);
    this._playbookHandler = playbookHandler;
    this._refreshFunction = refreshFunction;
    this.setDict();
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
      this._objectInput.showPanel();
    };
  }

  createBasicInput(name: string, value: object): BasicInput {
    return (this._objectInput = new StepVariableInput(
      name,
      value,
      this._playbookHandler,
      this._propertyType,
      this._refreshFunction,
    ));
  }

  setDefaultValues(defaultValues: any): void {
    for (const element in defaultValues) {
      this._defaultValues.push({ [element]: defaultValues[element] });
    }
  }

  submit() {
    let obj: any = {};
    this._elements.forEach(element => {
      let result = element.submit();
      if (result) {
        if (obj.hasOwnProperty(result[0])) {
          let index = 1;
          let incrementedKey = modifyKeyIfExist(result[0], index);
          while (obj.hasOwnProperty(incrementedKey)) {
            index++;
            incrementedKey = modifyKeyIfExist(result[0], index);
          }
          obj[incrementedKey] = result[1];
        } else {
          obj[result[0]] = result[1];
        }
      }
    });
    return obj;
  }
}

/**
 * Add a index at the end of a key
 * @param key
 * @param index
 */
function modifyKeyIfExist(key: string, index: number): string {
  let result: string;
  if (key.endsWith('__')) {
    result = key.slice(0, -2) + '_' + index.toString() + key.slice(-2);
  } else {
    result = key + index.toString();
  }
  return result;
}
