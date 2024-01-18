import { Identifier } from '../data-types/Identifier';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface SwitchConditionStepProps extends WorkflowStepProps {
  switch: string;
  cases: {
    [k: string]: Identifier;
  };
}

export interface SwitchConditionStep extends SwitchConditionStepProps {}
export class SwitchConditionStep extends WorkflowStep {
  constructor(partialprops: Partial<SwitchConditionStepProps> = {}) {
    const props: SwitchConditionStepProps =
      partialprops as SwitchConditionStepProps;
    super(props);
    this.type = 'switch-condition';
    this.switch = props.switch;
    this.cases = Object.assign({}, props.cases);
  }

  updateObjectProperty(props: any, prop: any): boolean {
    if (prop === 'cases' && props.cases) {
      this.cases = Object.assign({}, props.cases);
      return true;
    }
    return super.updateObjectProperty(props, prop);
  }
}
