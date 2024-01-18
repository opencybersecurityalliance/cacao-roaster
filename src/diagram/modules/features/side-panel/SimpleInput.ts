import { SingleInput } from './SingleInput';

/**
 * Reprensentes a container to display only a basicInput.
 */
export class SimpleInput extends SingleInput {
  _itemContainer: HTMLElement;

  constructor(
    propertyName: string,
    container: HTMLElement,
    itemContainer: HTMLElement,
  ) {
    super(propertyName, container);
    this._itemContainer = itemContainer;
  }

  addToContainer() {
    this._itemContainer.classList.add('list-input');

    this._basicInput?.setContainer(this._itemContainer);

    this._basicInput?.addToContainer();
    this._container.appendChild(this._itemContainer);
  }

  submit(): any {
    if (this._basicInput) {
      return this._basicInput.submit();
    }
  }
}
