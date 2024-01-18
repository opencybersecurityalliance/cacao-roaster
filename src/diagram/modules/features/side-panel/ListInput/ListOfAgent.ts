import { AgentTargetsInput } from '../AgentTargetsInput';
import { BasicInput } from '../BasicInput';
import { AgentTargetElement } from '../BasicInputs/AgentTargetElement';
import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';

/**
 * A ListOfAgent is a AgentTargetsInput containing a AgentDefinition.
 */
export class ListOfAgent extends AgentTargetsInput {
  _agentInput!: AgentTargetElement;
  _ValueList: any;

  constructor(
    propertyName: string,
    propertyType: string,
    possibleValues: any,
    playbookHandler: PlaybookHandler,
    container: HTMLElement,
  ) {
    super(propertyName, propertyType, possibleValues, container);
    this._playbookHandler = playbookHandler;
  }

  createBasicInput(name: string, value: string): BasicInput {
    let isDefaultValue =
      this._defaultValues && Object.keys(this._defaultValues).length != 0
        ? this._defaultValues.includes(Object.keys(value)[0])
        : false;
    this._agentInput = new AgentTargetElement(
      name,
      value,
      isDefaultValue,
      this._playbookHandler,
      true,
    );
    this._agentInput.setReloadCallback(() => {
      this._reloadCallback();
    });
    this._agentInput.setClearFunction(() => {
      this._clearFunction();
    });
    return this._agentInput;
  }

  submit(): string {
    let temp = '';
    this._elements.forEach(element => {
      let selectedElement = element.submit();
      if (selectedElement != undefined) {
        temp = selectedElement;
        return;
      }
    });
    return temp;
  }
}
