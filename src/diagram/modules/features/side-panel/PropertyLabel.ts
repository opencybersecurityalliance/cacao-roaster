import { PanelElement } from './PanelElement';

/**
 * Represents the whole label displayed with the label element
 * and the red dot if the property is required.
 */
export class PropertyLabel extends PanelElement {
  _displayedValue: string;
  _required: boolean;
  _description: string;

  /**
   *
   * @param displayedValue the string displayed inside the label
   * @param isRequired if the property is required, a red dot is displayed
   * @param container html element
   */
  constructor(
    displayedValue: string,
    isRequired: boolean,
    container: HTMLElement,
    description = '',
  ) {
    super(container);
    this._required = isRequired;
    this._displayedValue = displayedValue;
    this._description = description;
  }

  addToContainer() {
    this._container.classList.add('property__label');

    let requiredDot = document.createElement('div');
    requiredDot.classList.add('label__indicator');
    if (this._required) {
      requiredDot.classList.add('indicator--required');
    } else {
      requiredDot.classList.add('indicator--optional');
    }

    let label = document.createElement('label');
    label.textContent = this._displayedValue.replace(/_/g, ' ');

    if (this._description != '') {
      label.setAttribute('data-tooltip', this._description);
      label.classList.add('label__tooltip');
    }

    this._container.appendChild(requiredDot);
    this._container.appendChild(label);
  }

  name(): string {
    return this._displayedValue;
  }
}
