import { PanelInput } from './PanelInput';

/**
 * Creates titles used inside panels.
 */
export class TitleInput extends PanelInput {
  _title!: HTMLDivElement;
  _initialValue: any;
  _shouldSubmit: boolean;

  constructor(
    propertyName: string,
    initialValue: any,
    container: HTMLElement,
    shouldSubmit?: boolean,
  ) {
    super(propertyName, container);
    this._initialValue = initialValue;
    this._shouldSubmit = shouldSubmit != undefined ? shouldSubmit : true;
    this._title = document.createElement('div');
  }

  addClass(classToAdd: string): void {
    this._title.classList.add(classToAdd);
  }

  addToContainer(): void {
    this._title.classList.add('section__property');

    if (this._initialValue != null) {
      this._title.innerHTML =
        this._propertyName != 'id'
          ? this._initialValue.replace(/[-_]/g, ' ')
          : this._initialValue;
    }

    this._container?.appendChild(this._title);
  }

  submit(): any {
    if (this._shouldSubmit) {
      return this._initialValue;
    }
  }

  name(): string {
    return this._propertyName;
  }
}
