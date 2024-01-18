/**
 * PanelElement are elements that are contained within the PropertyPanel
 * elements list, and are to be displayed within PropertyPanels.
 */
export abstract class PanelElement {
  _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
  }

  /**
   * Returns propertyName
   * @returns string
   */
  abstract name(): string;

  /**
   * Calls the a side panel function to pricise if the list is displayed or not
   * @param isDisplayedList
   */
  setDisplayed(isDisplayedList: boolean): void {}

  /**
   * Add the graphic part of the property inside the html container
   */
  addToContainer() {}
}
