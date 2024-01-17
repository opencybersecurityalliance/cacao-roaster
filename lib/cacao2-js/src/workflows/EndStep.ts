import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface EndStepProps extends WorkflowStepProps {}

export interface EndStep extends EndStepProps {}
export class EndStep extends WorkflowStep {
  constructor(partialprops: Partial<EndStepProps> = {}) {
    const props: EndStepProps = partialprops as EndStepProps;
    super(props);
    this.type = 'end';
  }
}
