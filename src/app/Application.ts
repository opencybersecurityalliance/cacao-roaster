import { Playbook } from '../../lib/cacao2-js/src/Playbook';
import { WorkflowStep } from '../../lib/cacao2-js/src/workflows/WorkflowStep';

import { v4 as uuidv4 } from 'uuid';
import UserSettingsProps from './UserSettingsProps';

export default abstract class Application {
  protected _container: HTMLElement;

  constructor(container: HTMLElement) {
    this._container = container;
    this._container.id = 'cacao-application';
  }
}

export function newPlaybook(): Playbook {
  let start_id = 'start--' + uuidv4();

  let workflow: { [k: string]: WorkflowStep } = {};
  workflow[start_id] = { type: 'start' } as WorkflowStep;

  let playbook = new Playbook({
    id: 'playbook--' + uuidv4(),
    name: 'Playbook Name',
    description: 'Playbook Description',
    workflow_start: start_id,
    workflow: workflow,
  });
  if (UserSettingsProps.instance.isFulfil) {
    playbook.created_by = UserSettingsProps.instance.identifier;
  }
  return playbook;
}
