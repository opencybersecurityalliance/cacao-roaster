import { ActionStep, ActionStepProps } from './ActionStep';
import { EndStep, EndStepProps } from './EndStep';
import { IfConditionStep, IfConditionStepProps } from './IfConditionStep';
import { ParallelStep, ParallelStepProps } from './ParallelStep';
import {
  PlaybookActionStep,
  PlaybookActionStepProps,
} from './PlaybookActionStep';
import { StartStep, StartStepProps } from './StartStep';
import {
  SwitchConditionStep,
  SwitchConditionStepProps,
} from './SwitchConditionStep';
import {
  WhileConditionStep,
  WhileConditionStepProps,
} from './WhileConditionStep';
import { WorkflowStepProps, WorkflowStep } from './WorkflowStep';

/**
 * This factory is used for importing already existing playbooks, to
 * make sure that the correct WorkflowStep is chosen.
 */
export abstract class WorkflowStepFactory {
  static create(props: Partial<WorkflowStepProps>): WorkflowStep {
    switch (props.type) {
      case 'start':
        return new StartStep(props as StartStepProps);
      case 'end':
        return new EndStep(props as EndStepProps);
      case 'action':
        return new ActionStep(props as ActionStepProps);
      case 'playbook-action':
        return new PlaybookActionStep(props as PlaybookActionStepProps);
      case 'parallel':
        return new ParallelStep(props as ParallelStepProps);
      case 'if-condition':
        return new IfConditionStep(props as IfConditionStepProps);
      case 'while-condition':
        return new WhileConditionStep(props as WhileConditionStepProps);
      case 'switch-condition':
        return new SwitchConditionStep(props as SwitchConditionStepProps);
      default:
        throw new Error(`Unknown step type: ${props.type}`);
    }
  }
}
