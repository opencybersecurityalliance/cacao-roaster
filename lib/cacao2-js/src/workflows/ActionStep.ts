import { CommandData } from '../commands/CommandData';
import { CommandDataFactory } from '../commands/CommandsFactory';
import { Identifier } from '../data-types/Identifier';
import { WorkflowStep, WorkflowStepProps } from './WorkflowStep';

export interface ActionStepProps extends WorkflowStepProps {
  commands: Partial<CommandData>[];
  agent: Identifier;
  targets: Identifier[];
  in_args: string[];
  out_args: string[];
}

export interface ActionStep extends ActionStepProps {}
export class ActionStep extends WorkflowStep {
  constructor(partialprops: Partial<ActionStepProps> = {}) {
    const props: ActionStepProps = partialprops as ActionStepProps;
    super(props);
    this.type = 'action';
    this.commands = [];
    if (props.commands) {
      this.commands = props.commands.map(cmd => CommandDataFactory.create(cmd));
    }
    this.agent = props.agent;
    this.targets = [];
    if (props.targets) {
      this.targets = Array.from(props.targets);
    }
    this.in_args = [];
    if (props.in_args) {
      this.in_args = Array.from(props.in_args);
    }
    this.out_args = [];
    if (props.out_args) {
      this.out_args = Array.from(props.out_args);
    }
  }

  updateObjectProperty(props: any, prop: any): boolean {
    if (prop === 'commands' && props.commands) {
      this.commands = props.commands.map((cmd: any) =>
        CommandDataFactory.create(cmd),
      );
      return true;
    }
    return super.updateObjectProperty(props, prop);
  }
}
