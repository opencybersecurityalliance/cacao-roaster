import { PanelButton } from './PanelButton';
import { SingleInput } from './SingleInput';

/**
 * ItemInputs are meant to be part of a ListInput. They have a 'x' PanelButton
 * to be removed from the ListInput.
 */
export class ItemInput extends SingleInput {
  _itemContainer?: HTMLElement;
  _removeButton?: PanelButton;

  addToContainer() {
    this._itemContainer = document.createElement('div');
    this._itemContainer.classList.add('list__item');

    this._basicInput?.setContainer(this._itemContainer);
    this._basicInput?.setUpdate(this._updateFunction);
    this._removeButton = new PanelButton('x', this._itemContainer, () => {
      this.remove();
    });
    this._removeButton.addClass('display__item');
    this._removeButton.addClass('remove-item');
    this._basicInput?.addToContainer();
    this._removeButton.addToContainer();
    this._container.appendChild(this._itemContainer);
  }

  submit(): any {
    if (this._basicInput) {
      return this._basicInput.submit();
    }
  }

  /**
   * Removes the elemnt from its ListInput.
   */
  remove(): void {
    this._itemContainer?.remove();
    delete this._basicInput;
    this._updateFunction();
  }
}
