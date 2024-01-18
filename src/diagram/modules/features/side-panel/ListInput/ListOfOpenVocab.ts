import { BasicInput } from '../BasicInput';
import { OpenDropDownInput } from '../BasicInputs/OpenDropDownInput';
import { ListInput } from '../ListInput';

/**
 * A ListOfOpenVocab is a ListInput containing multiple OpenDropDownInputs.
 */
export class ListOfOpenVocab extends ListInput {
  _optionsList!: string[];
  _alreadyUsedOption: string[] = [];
  _indexBasicInput: number = 0;
  _openDropDownList: OpenDropDownInput[] = [];

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
    Object.values(defaultValues).forEach((element: any) => {
      this._defaultValues.push(element);
      this._alreadyUsedOption.push(element);
      this._indexBasicInput++;
    });
  }

  /**
   * Stores already used values to not propose then for the next drop down.
   * @param option The value to store.
   * @param index The drop down index.
   */
  addalreadyUsedOption(option: string, index: number) {
    if (index < this._alreadyUsedOption.length) {
      this._alreadyUsedOption[index] = option;
    } else if (index == this._alreadyUsedOption.length) {
      this._alreadyUsedOption.push(option);
    }
    for (let element of this._openDropDownList) {
      element.setOptions(
        this._optionsList.filter(
          element => !this._alreadyUsedOption.includes(element),
        ),
      );
      element.reloadOption();
    }
  }

  createBasicInput(name: string, value: string): BasicInput {
    this._alreadyUsedOption.push(value);
    let temp = new OpenDropDownInput(
      name,
      value,
      this._optionsList.filter(
        element => !this._alreadyUsedOption.includes(element),
      ),
    );
    this._openDropDownList.push(temp);
    temp.setListener((option: string, index: number) => {
      this.addalreadyUsedOption(option, index);
    }, this._indexBasicInput);
    this._indexBasicInput++;
    return temp;
  }
}
