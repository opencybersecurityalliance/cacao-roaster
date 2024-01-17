import { PropertyLabel } from './PropertyLabel';
import { SingleInput } from './SingleInput';

/**
 * Inputs that are meant to have a label on top of them.
 */
export class LabeledInput extends SingleInput {
  _labeledInputContainer: HTMLDivElement;
  _description: string;

  constructor(propertyName: string, container: HTMLElement, description = '') {
    super(propertyName, container);
    this._labeledInputContainer = document.createElement('div');
    this._description = description;
  }

  addToContainer() {
    this._labeledInputContainer.classList.add('section__property');
    this._labeledInputContainer.classList.add('property--simple');

    let labelContainer = document.createElement('div');

    let label = new PropertyLabel(
      this._propertyName,
      this._required,
      labelContainer,
      this._description,
    );
    this._basicInput?.setContainer(this._labeledInputContainer);
    label.addToContainer();
    this._labeledInputContainer.appendChild(labelContainer);
    this._basicInput?.setUpdate(this._updateFunction);
    this._basicInput?.addToContainer();
    this._container.appendChild(this._labeledInputContainer);
  }

  submit(): any {
    if (this._basicInput) {
      return this._basicInput.submit();
    }
  }

  /**
   * Adds a class to the label container
   * @param newClass
   */
  addClass(newClass: string): void {
    this._labeledInputContainer.classList.add(newClass);
  }
}
