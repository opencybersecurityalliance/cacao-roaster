/**
 * BasicInputs are inputs that when submitted should return a single value.
 */
export abstract class BasicInput {
  _container!: HTMLElement;
  _inputName: string;
  _initialValue: any;
  _updateFunction: any = () => {};

  constructor(inputName: string, initialValue: any) {
    this._inputName = inputName;
    this._initialValue = initialValue;
  }

  setContainer(container: HTMLElement) {
    this._container = container;
  }

  /**
   * Set a function to update the property inside the side panel
   * @param funct
   */
  setUpdate(funct: any) {
    this._updateFunction = funct;
  }

  /**
   * Add the graphic part of the property inside the html container
   */
  abstract addToContainer(): void;

  /**
   * Submit the value of the property
   */
  abstract submit(): string;
}
