import { BasicInput } from '../BasicInput';

/**
 * The input to display and edit boolean properties.
 */
export class CheckboxInput extends BasicInput {
  _inputField?: HTMLInputElement;
  _isToggleSwitch: boolean;
  _alignRight: boolean;

  constructor(
    inputName: string,
    initialValue: any,
    isToggleSwitch: boolean = false,
    alignRight: boolean = true,
  ) {
    super(inputName, initialValue);
    this._isToggleSwitch = isToggleSwitch;
    this._alignRight = alignRight;
  }

  addToContainer(): void {
    this._inputField = document.createElement('input');
    this._inputField.type = 'checkbox';
    this._inputField.name = this._inputName;
    this._inputField.classList.add('propertiesElements');
    if (this._initialValue != null) {
      this._inputField.checked = this._initialValue;
    }
    this._inputField.addEventListener('change', () => {
      this._updateFunction();
    });
    this._inputField.addEventListener('click', event => {
      event.stopPropagation();
    });
    if (this._isToggleSwitch) {
      let toggleSwitch = document.createElement('label');
      toggleSwitch.classList.add('toggleswitch');
      toggleSwitch.appendChild(this._inputField);
      let toggleSwitchSpan = document.createElement('span');
      toggleSwitchSpan.classList.add('toggleslider');
      toggleSwitchSpan.classList.add('round');
      toggleSwitch.appendChild(toggleSwitchSpan);
      this._container.appendChild(toggleSwitch);
      if (this._alignRight) {
        this._container.classList.add('property--right');
      }
    } else {
      this._container?.appendChild(this._inputField);
    }
  }

  submit(): any {
    if (this._inputField) {
      return this._inputField.checked;
    }
  }
}
