import { AgentTargetsInput } from '../AgentTargetsInput';
import { BasicInput } from '../BasicInput';
import { AgentTargetElement } from '../BasicInputs/AgentTargetElement';
import PlaybookHandler from '../../../model/PlaybookHandler';

/**
 * A ListOfTargets is a AgentTargetsInput containing multiple AgentTargetElement.
 */
export class ListOfTargets extends AgentTargetsInput {
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
      Object.keys(this._defaultValues).length != 0
        ? this._defaultValues.includes(Object.keys(value)[0])
        : false;
    this._agentInput = new AgentTargetElement(
      name,
      value,
      isDefaultValue,
      this._playbookHandler,
    );
    this._agentInput.setReloadCallback(() => {
      this._reloadCallback();
    });
    this._agentInput.setClearFunction(() => {
      this._clearFunction();
    });
    return this._agentInput;
  }

  submit(): string[] {
    let temp: string[] = [];
    this._elements.forEach(element => {
      let selectedElement = element.submit();
      if (selectedElement != undefined) {
        temp.push(selectedElement);
      }
    });
    return temp;
  }
}
