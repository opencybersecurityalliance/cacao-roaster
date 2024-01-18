import { Identifier } from '../data-types/Identifier';
import { Timestamp } from '../data-types/Timestamp';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface PlaybookActionStepProps extends WorkflowStepProps {
  playbook_id: Identifier;
  playbook_version: Timestamp;
  in_args: string[];
  out_args: string[];
}

export interface PlaybookActionStep extends PlaybookActionStepProps {}
export class PlaybookActionStep extends WorkflowStep {
  constructor(partialprops: Partial<PlaybookActionStepProps> = {}) {
    const props: PlaybookActionStepProps =
      partialprops as PlaybookActionStepProps;
    super(props);
    this.type = 'playbook-action';
    this.playbook_id = props.playbook_id;
    this.playbook_version = props.playbook_version;
    this.in_args = [];
    if (props.in_args) {
      this.in_args = Array.from(props.in_args);
    }
    this.out_args = [];
    if (props.out_args) {
      this.out_args = Array.from(props.out_args);
    }
  }
}
