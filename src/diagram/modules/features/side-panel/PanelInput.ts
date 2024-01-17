import { PanelElement } from './PanelElement';

/**
 * PanelInput are elements of the PropertyPanel that contain information to
 * be stored inside the Playbook, unlike buttons or labels.
 */
export abstract class PanelInput extends PanelElement {
  _required: boolean = false;
  _propertyName: string;
  _updateFunction: any = () => {};

  constructor(propertyName: string, container: HTMLElement) {
    super(container);
    this._propertyName = propertyName;
  }

  /**
   * Set a function to update the property inside the side panel
   * @param funct
   */
  setUpdate(funct: any) {
    this._updateFunction = funct;
  }

  /**
   * Sets the required boolean, for properties that are required per the
   * CACAO specifications.
   * @param isRequired
   */
  setRequired(isRequired: boolean) {
    this._required = isRequired;
  }

  name(): string {
    return this._propertyName;
  }

  /**
   * Returns the information of the PanelInput to be stored inside
   * the Playbook.
   */
  abstract submit(): any;
}
