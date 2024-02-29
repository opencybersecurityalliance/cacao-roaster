import { BasicInput } from '../BasicInput';

/**
 * A CommandInput is a BasicInput specific for command and command_b64.
 * It is used to make command and command_b64 mutually exclusive, and to save
 * command_b64 in base64.
 */
export class CommandInput extends BasicInput {
  _commandField!: HTMLTextAreaElement;
  _lambda: (param: boolean) => void = () => {};
  _commandValue!: string;
  _isBase64: boolean = false;
  _disabled: boolean = false;

  constructor(inputName: string, initialValue: any) {
    super(inputName, initialValue);
    this._commandField = document.createElement('textarea');
  }

  /**
   * Set to true if the Command is in base64
   * @param isBase64 boolean
   */
  setIsBase64(isBase64: boolean) {
    this._isBase64 = isBase64;
  }

  /**
   * Sets a lambda function that will be executed on 'input' of the _commandField.
   * @param lambda (param: boolean) => void)
   */
  setLambda(lambda: (param: boolean) => void) {
    this._lambda = lambda;
  }

  /**
   * Disables the textArea on true, enables it on false.
   * @param disable boolean
   */
  setDisabled(disable: boolean) {
    this._disabled = disable;
    this._commandField.disabled = this._disabled;
  }

  addToContainer(): void {
    this._commandField.name = this._inputName;
    this._commandField.classList.add('property__container');
    this._commandField.classList.add('container--simple');
    this._commandField.classList.add('container--textarea');

    if (this._initialValue) {
      if (this._isBase64) {
        this._commandField.value = Buffer.from(this._initialValue, 'base64').toString('utf-8');
      } else {
        this._commandField.value = this._initialValue;
      }
    }

    this._commandField.addEventListener('input', () => {
      if (this._commandField.value.trim().length > 0) {
        this._lambda(true);
      } else {
        this._lambda(false);
      }
    });
    this._commandField.dispatchEvent(new Event('input', {}));
    this._container?.appendChild(this._commandField);
  }

  submit(): any {
    if (this._commandField) {
      if (this._isBase64) {
        return Buffer.from(this._commandField.value, 'utf-8').toString('base64');
      }
      return this._commandField.value;
    }
  }
}
