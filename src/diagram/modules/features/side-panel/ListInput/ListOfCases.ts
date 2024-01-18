import { BasicInput } from '../BasicInput';
import { CaseInput } from '../BasicInputs/CaseInput';
import { ComplexInput } from '../ComplexInput';
import { PropertyLabel } from '../PropertyLabel';

/**
 * A ListOfCases is a ListInput containing multiple CaseInput.
 */
export class ListOfCases extends ComplexInput {
  _defaultValues: Array<any> = [];
  _elements: Array<BasicInput> = [];
  _list: HTMLElement = document.createElement('div');
  _headerExpander!: HTMLElement;
  _bodyListContainer: HTMLDivElement = document.createElement('div');

  constructor(
    propertyName: string,
    propertyType: string,
    container: HTMLElement,
  ) {
    super(propertyName, propertyType, container);
    this._bodyListContainer.classList.add(
      'section__property',
      'property--complexe',
    );
    this._list.classList.add('property__dict');
  }

  /**
   * Expands the graphic property's list
   */
  expand() {
    this._list.classList.add('list--expanded');
    this._list.classList.remove('list--collapse');
    this._headerExpander.classList.add('expander--close');
    this._headerExpander.classList.remove('expander--open');
  }

  /**
   * Collapses the graphic property's list
   */
  collapse() {
    this._list.classList.add('list--collapse');
    this._list.classList.remove('list--expanded');
    this._headerExpander.classList.remove('expander--close');
    this._headerExpander.classList.add('expander--open');
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
    this.expand();
  }

  addToContainer(): void {
    this.createExpanderButton();
    this._defaultValues?.forEach((item: any) => {
      this.addElement(item);
    });

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

    let labelTag: HTMLElement | null;
    labelTag = labelHeader.firstChild
      ? (labelHeader.firstChild as HTMLElement)
      : null;
    while (labelTag && labelTag.tagName != 'LABEL') {
      labelTag = labelHeader.firstChild
        ? (labelTag.nextSibling as HTMLElement)
        : null;
    }

    this._bodyListContainer.appendChild(labelHeader);
    this._bodyListContainer.appendChild(this._list);
    this._container.appendChild(this._bodyListContainer);
  }

  /**
   * Adds a CasesInput.
   * @param item Array<string> where item[0] is the condition and item[1] is the step id.
   */
  addElement(item: Array<string>) {
    let itemInput = this.createBasicInput(
      this._propertyName + this._elements.length,
      item,
    );
    itemInput.setContainer(this._list);
    itemInput.setUpdate(this._updateFunction);
    this._elements.push(itemInput);
    itemInput.addToContainer();
    this.expand();
  }

  setDefaultValues(defaultValues: any): void {
    Object.entries(defaultValues).forEach((element: any) => {
      this._defaultValues.push(element);
    });
  }

  createBasicInput(name: string, value: any): BasicInput {
    return new CaseInput(name, value[0], value[1]);
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
