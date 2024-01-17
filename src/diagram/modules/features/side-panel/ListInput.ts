import CacaoUtils from '../../core/CacaoUtils';
import { BasicInput } from './BasicInput';
import { ComplexInput } from './ComplexInput';
import { ItemInput } from './ItemInput';
import { PanelButton } from './PanelButton';
import { PropertyLabel } from './PropertyLabel';

/**
 * Listinput contains a list of inputs. In the PropertyPanel, they can be
 * collapsed and extended. They have a '+' PanelButton to add new elements to
 * the list.
 */
export abstract class ListInput extends ComplexInput {
  _defaultValues: Array<any> = [];
  _elements: Array<ItemInput> = [];
  _list: HTMLElement = document.createElement('div');
  _headerExpander!: HTMLElement;
  _addFunction!: any;
  _shouldDisplayElements!: boolean;
  _displayFunction: any;
  _bodyListContainer: HTMLDivElement = document.createElement('div');

  constructor(
    propertyName: string,
    propertyType: string,
    container: HTMLElement,
    displayFunction: any,
  ) {
    super(propertyName, propertyType, container);
    this._displayFunction = displayFunction;
    this._bodyListContainer.classList.add(
      'section__property',
      'property--complexe',
    );
    this._list.classList.add('property__list');
  }

  /**
   * Sets a function to be used when clicking the PanelButton.
   */
  abstract setAddFunction(): void;

  /**
   * Creates a basic input of the specific type of the list
   * to be used in other functions.
   * @param name HTML attribute field 'name' of the input field
   * @param value default value of the input field
   */
  abstract createBasicInput(name: string, value: any): BasicInput;

  /**
   * Expands the graphic property's list
   */
  expand() {
    this._list.classList.add('list--expanded');
    this._list.classList.remove('list--collapse');
    this._headerExpander.classList.add('expander--close');
    this._headerExpander.classList.remove('expander--open');
    this._bodyListContainer.classList.add('lisContainer--expanded');
  }

  /**
   * Collapses the graphic property's list
   */
  collapse() {
    this._list.classList.add('list--collapse');
    this._list.classList.remove('list--expanded');
    this._headerExpander.classList.remove('expander--close');
    this._headerExpander.classList.add('expander--open');
    this._bodyListContainer.classList.remove('lisContainer--expanded');
  }

  /**
   * Creates a arrow button to expand or collapse the graphic list
   */
  createExpanderButton() {
    this._headerExpander = document.createElement('div');
    this._headerExpander.classList.add('label__expander');

    this._headerExpander!.addEventListener('click', () => {
      if (this._list.classList.contains('list--expanded')) {
        this.collapse();
      } else {
        this.expand();
      }
    });
    this.collapse();
  }

  addToContainer(): void {
    this.createExpanderButton();

    this._defaultValues?.forEach((item: any) => {
      this.addElement(item);
    });
    this._shouldDisplayElements = true;

    let labelHeader = document.createElement('div');
    labelHeader.classList.add('label--complexe');

    let label = new PropertyLabel(
      this._propertyName,
      this._required,
      labelHeader,
      this._description,
    );
    label.addToContainer();

    labelHeader.appendChild(this._headerExpander);

    this.setAddFunction();
    let addButton = new PanelButton('+', labelHeader, this._addFunction);
    addButton.addClass('label__adder');
    addButton.addToContainer();

    labelHeader!.addEventListener('click', () => {
      if (this._list.classList.contains('list--expanded')) {
        this._shouldDisplayElements = true;
      } else {
        this._shouldDisplayElements = false;
      }
      this._displayFunction(this._propertyName, this._shouldDisplayElements);
    });
    if (this._shouldDisplayElements) {
      this.expand();
    } else {
      this.collapse();
    }

    this._bodyListContainer.appendChild(labelHeader);
    this._bodyListContainer.appendChild(this._list);
    this._container.appendChild(this._bodyListContainer);
  }

  setDict() {
    this._list.classList.remove('property__list');
    this._list.classList.add('property__dict');
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
    itemInput.setUpdate(this._updateFunction);
    itemInput.setBasicInput(
      this.createBasicInput(this._propertyName + this._elements.length, item),
    );
    this._elements.push(itemInput);
    itemInput.addToContainer();
    this.expand();
    this._shouldDisplayElements = true;
  }

  submit(): any {
    let list: Array<string> = [];
    this._elements.forEach(element => {
      let result = element.submit();
      if (result && CacaoUtils.filterEmptyValues(result)) {
        list.push(result);
      }
    });
    return list;
  }

  setDisplayed(isDisplayedList: boolean): void {
    this._shouldDisplayElements = isDisplayedList;
  }
}
