import { Identifier } from '../data-types/Identifier';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface WhileConditionStepProps extends WorkflowStepProps {
  condition: string;
  on_true: Identifier;
}

export interface WhileConditionStep extends WhileConditionStepProps {}
export class WhileConditionStep extends WorkflowStep {
  constructor(partialprops: Partial<WhileConditionStepProps> = {}) {
    const props: WhileConditionStepProps =
      partialprops as WhileConditionStepProps;
    super(props);
    this.type = 'while-condition';
    this.condition = props.condition;
    this.on_true = props.on_true;
  }
}
