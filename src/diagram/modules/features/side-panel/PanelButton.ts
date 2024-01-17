import sidePanel from '.';
import { PanelElement } from './PanelElement';

/**
 * Buttons that are used within the PropertyPanel.
 */
export class PanelButton extends PanelElement {
  _button: HTMLButtonElement = document.createElement('button');
  _linesContainer: HTMLDivElement = document.createElement('div');
  _propertyName: string;

  constructor(buttonName: string, container: HTMLElement, funct: () => void) {
    super(container);
    this._button.textContent = buttonName;
    this._button.addEventListener('click', event => {
      funct();
      // Prevents clicking on its parent
      event.stopPropagation();
    });
    this._propertyName = buttonName;
    this._linesContainer.classList.add(
      'property__status__element--button--textcontainer--inside',
    );
  }

  /**
   * Adds a class to the CSS properties of the button.
   * @param className CSS class name
   */
  addClass(className: string) {
    this._button.classList.add(className);
  }

  addToContainer() {
    this._container.appendChild(this._button);
  }

  addLine(textLine: string, className: string = '') {
    this._button.textContent = '';
    let span = document.createElement('span');
    if (!className.includes('title')) {
      let title = textLine.split(' ')[0];
      let text = textLine.replace(title, '');
      span.innerHTML = '<b>' + title + '</b>' + text;
    } else {
      span.textContent = textLine;
    }
    span.className = className;
    this._linesContainer.appendChild(span);
    this._button.appendChild(this._linesContainer);
  }

  name(): string {
    return this._propertyName;
  }

  /**
   * Changes the text contained by the button
   * @param buttonName string: the new name
   */
  updateText(buttonName: string) {
    this._button.textContent = buttonName;
  }
}
