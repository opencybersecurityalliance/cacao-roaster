import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { BasicInput } from '../BasicInput';
import { PanelButton } from '../PanelButton';
import PropertyPanel from '../PropertyPanel';
import { UneditableInput } from './UneditableInput';
import { valueToDisplay } from '../../../model/SchemaTypes';

/**
 * The input to display and edit agent.
 */
export class AgentInput extends BasicInput {
  _variableUneditableField!: UneditableInput;
  _propertyPanel!: PropertyPanel;
  _playbookHandler: PlaybookHandler;
  _displayDefDialog!: HTMLDialogElement;
  _refreshFunction: any;
  _listType: string;
  _agentOrTarget: string;
  _agentTargetPanel!: PropertyPanel;
  _propertyType: string;
  _tempValue!: any;
  _displayedValue: string = '';
  _agentButton?: PanelButton;

  constructor(
    inputName: string,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    propertyType: string,
    refreshFunction: any,
  ) {
    super(inputName, initialValue);
    this._propertyType = propertyType;
    this._playbookHandler = playbookHandler;
    this._refreshFunction = refreshFunction;
    this._listType = 'agents-display';
    this._agentOrTarget = 'agent';
  }

  addToContainer(): void {
    this.changeDisplayedValue(this._initialValue);
    this._agentButton = new PanelButton(
      this._displayedValue,
      this._container,
      () => {
        this.showPanel();
      },
    );
    this._agentButton.addClass('property__container');
    this._agentButton.addClass('container--simple');
    this._agentButton.addClass('container--disabled');
    this._agentButton.addToContainer();

    this._displayDefDialog = document.createElement('dialog');
    this._displayDefDialog.classList.add('agent-dialog');

    this._container.appendChild(this._displayDefDialog);
    this._agentTargetPanel = new PropertyPanel(
      this._playbookHandler,
      this._listType,
      this._initialValue,
      this._displayDefDialog,
    );
    this._agentTargetPanel.setIsAgentTarget(true);
    this._agentTargetPanel.setIsSubPanel(true);

    //Creates the "cancel" button to go back
    this._agentTargetPanel.addButton('Cancel', () => {
      this._agentTargetPanel.reloadClearedDifferentProperties(
        this._listType,
        this._tempValue,
      );
      this.changeDisplayedValue(this._tempValue);
      this._agentButton?.updateText(this._displayedValue);
      this._displayDefDialog.close();
      this._refreshFunction();
    });

    //Creates the "ok" button to submit selected values
    this._agentTargetPanel.addButton('Confirm', () => {
      let submitedValue = this._agentTargetPanel.submit();
      this._tempValue =
        Object.keys(submitedValue).length != 0
          ? Object.values(submitedValue)[0]
          : undefined;
      this.changeDisplayedValue(this._tempValue);
      this._displayDefDialog.close();
      this._agentButton?.updateText(this._displayedValue);
      this._refreshFunction();
    });

    this._agentTargetPanel.addDifferentProperties();
  }

  /**
   * update the value to display after modifications
   * @param submitedValue
   */
  private changeDisplayedValue(submitedValue: string) {
    if (Object.keys(valueToDisplay).includes(this._propertyType)) {
      let agent = this._playbookHandler.getAgent(submitedValue)
        ? this._playbookHandler.getAgent(submitedValue)
        : {};
      valueToDisplay[this._propertyType].some(field => {
        this._displayedValue = '';
        if ((agent as any)[field] != undefined && (agent as any)[field] != '') {
          this._displayedValue = (agent as any)[field];
          return true;
        }
      });
      if (this._displayedValue == '') {
        this._displayedValue = 'Add Agent';
      }
    }
    this._agentButton?.updateText(this._displayedValue);
  }

  //show the definition object panel.
  showPanel() {
    this._displayDefDialog.showModal();
  }

  submit(): any {
    return Object.values(this._agentTargetPanel.submit())[0];
  }
}
