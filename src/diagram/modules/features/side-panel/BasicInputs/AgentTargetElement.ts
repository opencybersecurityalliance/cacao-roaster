import { BasicInput } from '../BasicInput';
import { CheckboxInput } from './CheckboxInput';
import { RadioBoxInput } from './RadioBoxInput';
import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';
import { schemaDictWithoutCommands } from '../../../model/SchemaTypes';
import PropertyPanel from '../PropertyPanel';
import { v4 as uuidv4 } from 'uuid';
import { PanelButton } from '../PanelButton';

/**
 * AgentTargetElement display inside a table all elements from one definition property.
 * RadioBoxInput or CheckboxInput are used to select the value(s).
 */
export class AgentTargetElement extends BasicInput {
  _box!: BasicInput;
  _isAgent: boolean;
  _boxConstructor: typeof RadioBoxInput | typeof CheckboxInput;
  _agentTarget: any;
  _key: string;
  _val: any;
  _playbookHandler: PlaybookHandler;
  //Function to reload the panel after the submit.
  _reloadCallback: () => void = () => {};
  _clearFunction: () => void = () => {};

  constructor(
    inputName: string,
    agentTarget: any,
    initialValue: any,
    playbookHandler: PlaybookHandler,
    isAgent?: boolean,
  ) {
    super(inputName, initialValue);
    this._isAgent = isAgent != undefined ? isAgent : false;
    this._agentTarget = agentTarget;
    this._playbookHandler = playbookHandler;
    [[this._key, this._val]] = Object.entries(this._agentTarget) as [
      [string, any],
    ];
    this._boxConstructor = this._isAgent ? RadioBoxInput : CheckboxInput;
  }

  addToContainer(): void {
    let boxContainer = document.createElement('td');
    this._box = new this._boxConstructor(this._inputName, this._initialValue);
    this._box.setContainer(boxContainer);

    let typeContainer = document.createElement('td');
    let type = this._val.type ? this._val.type : '';
    typeContainer.textContent = type;

    let nameContainer = document.createElement('td');
    let name = this._val.name ? this._val.name : '';
    nameContainer.textContent = name;

    let descContainer = document.createElement('td');
    let desc = this._val.description ? this._val.description : '';
    descContainer.textContent = desc;
    descContainer.setAttribute('title', desc);

    this._box.addToContainer();

    let editButtonContainer = document.createElement('td');
    let agentType = this._val.type;
    if (!(this._val.type in schemaDictWithoutCommands)) {
      agentType = 'agent-target';
    }

    let agentDialog = document.createElement('dialog');
    agentDialog.classList.add('list-dialog');
    editButtonContainer.appendChild(agentDialog);
    let agentPanel: PropertyPanel;
    if (this._isAgent) {
      agentPanel = new PropertyPanel(
        this._playbookHandler,
        agentType,
        this._playbookHandler.getAgent(this._key),
        agentDialog,
      );
    } else {
      agentPanel = new PropertyPanel(
        this._playbookHandler,
        agentType,
        this._playbookHandler.getTarget(this._key),
        agentDialog,
      );
    }
    agentPanel.setIsAgentTarget(true);
    agentPanel.setIsSubPanel(true);
    agentPanel.addButton('Cancel', () => {
      agentDialog.close();
      this._reloadCallback();
    });
    agentPanel.addButton('Confirm', () => {
      let agentValue = agentPanel.confirm();
      let typeValue = agentValue.type;
      let oldKey = this._key;
      if (typeValue && typeValue != agentPanel._propertyType) {
        this._key = typeValue + '--' + uuidv4();
      }
      if (this._isAgent) {
        this._playbookHandler.setAgent(oldKey, [this._key, agentValue]);
      } else {
        this._playbookHandler.setTarget(oldKey, [this._key, agentValue]);
      }
      this._reloadCallback();
    });

    agentPanel.addAllProperties();

    this._container.addEventListener('click', () => {
      agentDialog.showModal();
    });

    let removeButton = new PanelButton('x', editButtonContainer, () => {
      this._container?.remove();
      if (this._isAgent) {
        this._playbookHandler.removeAgent(this._key);
      } else {
        this._playbookHandler.removeTarget(this._key);
      }
    });
    removeButton.addClass('remove-item');
    removeButton.addToContainer();

    this._container.appendChild(boxContainer);
    this._container.appendChild(typeContainer);
    this._container.appendChild(nameContainer);
    this._container.appendChild(descContainer);
    this._container.appendChild(editButtonContainer);
  }

  setReloadCallback(callback: () => void) {
    this._reloadCallback = callback;
  }

  setClearFunction(callback: () => void) {
    this._clearFunction = callback;
  }

  submit(): any {
    if (this._box.submit()) {
      return this._key;
    }
  }
}
