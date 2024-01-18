import { Identifier } from '../data-types/Identifier';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface IfConditionStepProps extends WorkflowStepProps {
  condition: string;
  on_true: Identifier;
  on_false: Identifier;
}

export interface IfConditionStep extends IfConditionStepProps {}
export class IfConditionStep extends WorkflowStep {
  constructor(partialprops: Partial<IfConditionStepProps> = {}) {
    const props: IfConditionStepProps = partialprops as IfConditionStepProps;
    super(props);
    this.type = 'if-condition';
    this.condition = props.condition;
    this.on_true = props.on_true;
    this.on_false = props.on_false;
  }
}
