import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface StartStepProps extends WorkflowStepProps {}

export interface StartStep extends StartStepProps {}
export class StartStep extends WorkflowStep {
  constructor(partialprops: Partial<StartStepProps> = {}) {
    const props: StartStepProps = partialprops as StartStepProps;
    super(props);
    this.type = 'start';
  }
}
