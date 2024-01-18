import {
  classDictWithoutAgentTarget,
  valueToDisplay,
} from '../../../model/SchemaTypes';
import PlaybookHandler from '../../../model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import CacaoUtils from '../../../core/CacaoUtils';

/**
 * The input to display and edit object.
 */
export class ObjectInput extends BasicInput {
  _itemButton!: PanelButton;
  _propertyPanel?: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _propertyType: string;
  _dialog!: HTMLDialogElement;
  _displayedValue: string = '';

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
  ) {
    super(inputName, initialValue);
    this._playbookHandler = playbookHandler;
    this._propertyType = propertyType;
  }

  /**
   * update the value to display after modifications
   * @param submitedValue
   */
  private changeDisplayedValue() {
    if (Object.keys(valueToDisplay).includes(this._propertyType)) {
      valueToDisplay[this._propertyType].some(field => {
        if (
          this._initialValue[field] != undefined &&
          this._initialValue[field] != ''
        ) {
          this._displayedValue = this._initialValue[field];
          return true;
        }
      });
      if (this._displayedValue == '') {
        this._displayedValue = this._propertyType;
      }
    }
  }

  addToContainer(): void {
    this._dialog = document.createElement('dialog');

    this._dialog.classList.add('list-dialog');

    this._container.appendChild(this._dialog);

    if (
      Object.keys(this._initialValue).length === 0 &&
      classDictWithoutAgentTarget[this._propertyType]
    ) {
      this._initialValue = new classDictWithoutAgentTarget[
        this._propertyType
      ]();
    }
    let propType = 'command-data';
    if (
      Object.keys(this._initialValue).length !== 0 &&
      classDictWithoutAgentTarget[this._initialValue['type']]
    ) {
      propType = this._initialValue['type'];
    }

    let tempValues = {};
    Object.assign(tempValues, this._initialValue);

    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      propType,
      this._initialValue,
      this._dialog,
    );
    this._propertyPanel.setIsAgentTarget(false);
    this._propertyPanel.setIsSubPanel(true);

    let confirm = () => {
      Object.assign(tempValues, this._propertyPanel!.confirm());
      this._updateFunction();
      this._initialValue = this.submit();
      this.changeDisplayedValue();
      this._itemButton?.updateText(this._displayedValue);
    };

    let cancel = () => {
      this._propertyPanel = new PropertyPanel(
        this._playbookHandler,
        this._propertyType,
        tempValues,
        this._dialog,
      );
      this._propertyPanel.setIsAgentTarget(false);
      this._propertyPanel._container.innerHTML = '';
      this._propertyPanel.setIsSubPanel(true);
      this._propertyPanel.addButton('Cancel', cancel);
      this._propertyPanel.addButton('Confirm', confirm);
      this._propertyPanel.addAllProperties();
      this.changeDisplayedValue();
      this._propertyPanel.close();
      this._updateFunction();
      if (!CacaoUtils.filterEmptyValues(tempValues)) {
        this._container.remove();
      }
    };

    this._propertyPanel.addButton('Cancel', cancel);
    this._propertyPanel.addButton('Confirm', confirm);

    this._propertyPanel.addAllProperties();

    this.changeDisplayedValue();
    this._itemButton = new PanelButton(
      this._displayedValue,
      this._container,
      () => {
        this.showPanel();
      },
    );
    this._itemButton.addClass('property__container');
    this._itemButton.addClass('container--simple');
    this._itemButton.addClass('container--disabled');

    this._itemButton.addToContainer();
  }

  /**
   * Displays the panel to edit the object.
   */
  showPanel() {
    this._dialog.showModal();
  }

  addClass(className: string) {
    this._itemButton.addClass(className);
  }

  submit(): any {
    const value = this._propertyPanel?.confirm();
    let propType = '';
    if (value['type'] in classDictWithoutAgentTarget) {
      propType = value['type'];
    } else if (classDictWithoutAgentTarget[this._propertyType]) {
      propType = this._propertyType;
    } else {
      return value;
    }
    return new classDictWithoutAgentTarget[propType](value);
  }
}
