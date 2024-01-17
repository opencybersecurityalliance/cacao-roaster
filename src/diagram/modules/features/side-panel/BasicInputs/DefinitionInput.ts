import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import { UneditableInput } from './UneditableInput';
import { v4 as uuidv4 } from 'uuid';
import {
  commonTypeDict,
  neededDefinitionProperties,
  propertiesFunction,
  updateProperty,
  valueToDisplay,
} from '../../../model/SchemaTypes';
import CacaoUtils from '../../../core/CacaoUtils';
import isEqual from 'lodash.isequal';

/**
 * The input to display and edit definition properties.
 */
export class DefinitionInput extends BasicInput {
  _key: string;
  _value: any;
  _variableUneditableField!: UneditableInput;
  _propertyPanel!: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _propertyType: string;
  _dialog!: HTMLDialogElement;
  //Function to refresh the panel
  _callback: any;
  _displayedValue: string = '';
  _editButton!: PanelButton;
  private _isNew: boolean;

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
    callback: any,
  ) {
    super(inputName, initialValue);
    this._isNew = false;
    if (Object.keys(initialValue).length === 0) {
      this._isNew = true;
      this._key = propertyType + '--' + uuidv4();
      this._value = { type: propertyType };
      for (const element of neededDefinitionProperties[propertyType]) {
        this._value[element] = propertiesFunction[element]();
      }
    } else {
      [[this._key, this._value]] = Object.entries(initialValue) as [
        [string, any],
      ];
      this._value = updateProperty(this._value);
    }
    this._playbookHandler = playbookHandler;
    this._propertyType = propertyType;
    this._callback = callback;
  }

  /**
   * update the value to display after modifications
   * @param submitedValue
   */
  private changeDisplayedValue() {
    let prop = this._propertyType;
    if (Object.keys(commonTypeDict).includes(prop)) {
      prop = commonTypeDict[prop];
    }
    if (Object.keys(valueToDisplay).includes(prop)) {
      valueToDisplay[prop].some(field => {
        if (
          (Object.values(this._initialValue)[0] as any) &&
          (Object.values(this._initialValue)[0] as any)[field] &&
          (Object.values(this._initialValue)[0] as any)[field] != ''
        ) {
          this._displayedValue = (Object.values(this._initialValue)[0] as any)[
            field
          ] as string;
          return true;
        }
      });
      if (this._displayedValue == '') {
        this._displayedValue = prop;
      }
    }
  }

  addToContainer(): void {
    this._dialog = document.createElement('dialog');
    this._dialog.className = 'list-dialog';
    this._container.appendChild(this._dialog);

    let tempValues = {};
    Object.assign(tempValues, this._value);
    this._propertyPanel = new PropertyPanel(
      this._playbookHandler,
      this._propertyType,
      this._value,
      this._dialog,
    );
    this._propertyPanel.setIsAgentTarget(true);
    this._propertyPanel.setIsSubPanel(true);

    let confirm = () => {
      this._value = this._propertyPanel!.submit();
      this._isNew = false;
      Object.assign(tempValues, this._propertyPanel!.confirm());
      let typeValue = (tempValues as any)['type'];
      if (typeValue && typeValue != this._value['type']) {
        this._propertyType = typeValue;
        this._key = typeValue + '--' + uuidv4();
      }
      this._callback();
      this._updateFunction();
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
        // _definitions properties contains Agents and Targets
        this._propertyPanel.setIsAgentTarget(true);
        this._propertyPanel._container.innerHTML = '';
        this._propertyPanel.setIsSubPanel(true);
        this._propertyPanel.addButton('Cancel', cancel);
        this._propertyPanel.addButton('Confirm', confirm);
        this._propertyPanel.addAllProperties();
        this._propertyPanel.close();
        this._updateFunction();
        this._callback();
      }
    };

    this._propertyPanel.addButton('Cancel', cancel);
    this._propertyPanel.addButton('Confirm', confirm);

    this._propertyPanel.addAllProperties();
    this.changeDisplayedValue();

    this._editButton = new PanelButton(
      this._displayedValue ? this._displayedValue : this._key,
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

  //show the definition object panel.
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
    let temp = [[this._key], this._value];
    if (!this.shouldBeRemoved(temp[1])) {
      return temp;
    }
  }
}
