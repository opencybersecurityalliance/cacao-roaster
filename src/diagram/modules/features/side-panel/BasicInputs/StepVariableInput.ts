import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import { TextFieldInput } from './TextFieldInput';
import isEqual from 'lodash.isequal';
import CacaoUtils from '../../../core/CacaoUtils';

/**
 * Handles properties which need variables.
 */
export class StepVariableInput extends BasicInput {
  _key: string;
  _value: any;
  _variableTextField!: TextFieldInput;
  _propertyPanel!: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _propertyType: string;
  _refreshFunction: any;
  _itemButton?: PanelButton;
  _dialog = document.createElement('dialog');
  _editButton!: PanelButton;
  private _isNew: boolean;

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
    refreshFunction: any,
  ) {
    super(inputName, initialValue);
    this._isNew = false;
    if (Object.keys(initialValue).length === 0) {
      this._key = '';
      this._value = {};
      this._isNew = true;
    } else {
      [[this._key, this._value]] = Object.entries(initialValue) as [
        [string, any],
      ];
    }
    this._playbookHandler = playbookHandler;
    this._propertyType = propertyType;
    this._refreshFunction = refreshFunction;
  }

  addToContainer(): void {
    this._dialog.classList.add('list-dialog');

    this._container.appendChild(this._dialog);

    let tempValues = {};
    Object.assign(tempValues, this._initialValue);

    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      this._propertyType,
      this._value,
      this._dialog,
    );
    this._propertyPanel.setIsAgentTarget(false);
    this._propertyPanel.setIsSubPanel(true);
    this._propertyPanel.setPropertyKey('variable', 'string', this._key);

    let confirm = () => {
      this._value = this._propertyPanel!.submit();
      this._isNew = false;
      Object.assign(tempValues, this._propertyPanel!.confirm());
      this._updateFunction();
      this._refreshFunction();
    };

    let cancel = () => {
      if (this.shouldBeRemoved(tempValues)) {
        this._container.remove();
      } else {
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
        this._propertyPanel.close();
        this._updateFunction();
      }
    };

    this._propertyPanel.addButton('Cancel', cancel);
    this._propertyPanel.addButton('Confirm', confirm);

    this._propertyPanel.addAllProperties();

    this._editButton = new PanelButton(
      this._key ? this._key : this._inputName,
      this._container,
      () => {
        this.showPanel();
      },
    );
    this._editButton.addClass('property__container');
    this._editButton.addClass('container--simple');
    this._editButton.addClass('container--disabled');

    this._editButton.addToContainer();
  }

  showPanel() {
    this._dialog.showModal();
  }

  private shouldBeRemoved(currentValue: any): boolean {
    return (
      isEqual(
        CacaoUtils.filterEmptyValues(currentValue),
        CacaoUtils.filterEmptyValues(this._value),
      ) && this._isNew
    );
  }

  submit(): any {
    let temp = [this._propertyPanel.getPropertyKey(), this._value];
    if (!this.shouldBeRemoved(temp[1])) {
      return temp;
    }
  }
}
