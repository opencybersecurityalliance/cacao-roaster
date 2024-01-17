import { Identifier } from '../data-types/Identifier';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface ParallelStepProps extends WorkflowStepProps {
  next_steps: Identifier[];
}

export interface ParallelStep extends ParallelStepProps {}
export class ParallelStep extends WorkflowStep {
  constructor(partialprops: Partial<ParallelStepProps> = {}) {
    const props: ParallelStepProps = partialprops as ParallelStepProps;
    super(props);
    this.type = 'parallel';
    this.next_steps = [];
    if (props.next_steps) {
      this.next_steps = Array.from(props.next_steps);
    }
  }
  updateObjectProperty(props: any, prop: any): boolean {
    if (prop === 'next_steps' && props.next_steps) {
      this.next_steps = Array.from(props.next_steps);
      return true;
    }
    return super.updateObjectProperty(props, prop);
  }
}
