import PlaybookHandler from '../../model/PlaybookHandler';
import { BasicInput } from './BasicInput';
import { StatusInput } from './BasicInputs/StatusInput';
import { ItemInput } from './ItemInput';
import { PropertyLabel } from './PropertyLabel';
import { PanelButton } from './PanelButton';
import { ComplexInput } from './ComplexInput';

/**
 * The class which handles the definition properties.
 * The keys are displayed inside the list from the ListInput.
 */
export class DictionaryStatus extends ComplexInput {
  _playbookHandler: PlaybookHandler;
  _statusInput!: StatusInput;
  _callback: any;
  _defaultValues: Array<any> = [];
  _elements: Array<ItemInput> = [];
  _list!: HTMLElement;
  _addFunction!: any;
  _refreshFunction: any;
  _stepId!: string;

  constructor(
    propertyName: string,
    propertyType: string,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
    refreshFunction: any,
  ) {
    super(propertyName, propertyType, container);
    this._playbookHandler = playbookHandler;
    this._refreshFunction = refreshFunction;
    this._container.classList.add('executionstatus__container');
  }

  addToContainer(): void {
    let globalDiv = document.createElement('div');
    globalDiv.classList.add('section__property', 'property--complexe');

    this._list = document.createElement('div');
    this._list.classList.add('property__dict');

    for (const item of this._defaultValues) {
      this.addElement(item);
    }

    let labelHeader = document.createElement('div');
    labelHeader.classList.add('label--complexe');

    this.setAddFunction();
    let addButton = new PanelButton('+', labelHeader, this._addFunction);
    addButton.addClass('label__adder');
    addButton.addClass('adder__executionStatus');
    addButton.addToContainer();

    globalDiv.appendChild(labelHeader);
    globalDiv.appendChild(this._list);
    this._container.appendChild(globalDiv);
  }

  /**
   * Add an element to the list.
   * @param item to be added to the elements list.
   */
  addElement(item: any) {
    let itemInput = new ItemInput(
      this._propertyName + this._elements.length,
      this._list,
    );
    itemInput.setUpdate(() => {
      this._updateFunction();
      this._refreshFunction();
    });
    itemInput.setBasicInput(
      this.createBasicInput(this._propertyName + this._elements.length, item),
    );
    this._elements.push(itemInput);
    itemInput.addToContainer();
  }

  setAddFunction(): void {
    this._addFunction = () => {
      this.addElement({});
      this._statusInput.showPanel();
    };
  }

  createBasicInput(name: string, value: object): BasicInput {
    return (this._statusInput = new StatusInput(
      name,
      value,
      this._playbookHandler,
      this._propertyType,
      this._refreshFunction,
      this._stepId,
    ));
  }

  setDefaultValues(defaultValues: Array<any>): void {
    this._defaultValues = defaultValues;
    if (Array.isArray(this._defaultValues)) {
      this._defaultValues.sort(timeStampSort);
    }
  }

  setStepId(stepId: string) {
    this._stepId = stepId;
  }

  submit() {
    let list: any = [];
    this._elements.forEach(element => {
      let result = element.submit();
      if (result) {
        list.push(result);
      }
    });
    return list;
  }
}

function timeStampSort(a: any, b: any) {
  const date1 = new Date(a.start_time);
  const date2 = new Date(b.start_time);
  if (isNaN(date1.getTime()) && isNaN(date2.getTime())) {
    // Invalid date strings provided
    return 0;
  }
  // To compare two dates, you can directly use comparison operators
  if (date1 > date2) {
    return -1; // date1 is earlier than date2
  } else if (date1 < date2) {
    return 1; // date1 is later than date2
  }
  return 0; // date1 and date2 are equal
}
