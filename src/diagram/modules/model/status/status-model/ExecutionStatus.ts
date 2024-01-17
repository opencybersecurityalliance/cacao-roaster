import { Identifier } from 'lib/cacao2-js/src/data-types/Identifier';
import { Timestamp } from 'lib/cacao2-js/src/data-types/Timestamp';

export interface ExecutionStatusProps {
  workflow_status: StatusElement[];
}

export interface ExecutionStatus extends ExecutionStatusProps {}
export class ExecutionStatus {
  constructor(partialprops: Partial<ExecutionStatusProps> = {}) {
    const props: ExecutionStatusProps = partialprops as ExecutionStatusProps;
    this.workflow_status = [];
    for (const element of props.workflow_status) {
      props.workflow_status.push(new StatusElement(element));
    }
  }
}

export interface StatusElementProps {
  type: 'execution_status';
  id: Identifier;
  workflow_step: Identifier;
  start_time: Timestamp;
  duration: number;
  status:
    | 'successfully_completed'
    | 'failed'
    | 'ongoing'
    | 'server_side_error'
    | 'client_side_error'
    | 'timeout_error'
    | 'exception_condition_invoked';
  status_text: string;
  executed_by: Identifier;
  command_b64: string;
  notes: string;
  automated_execution: boolean;
}

export interface StatusElement extends StatusElementProps {}
export class StatusElement {
  constructor(partialprops: Partial<StatusElementProps> = {}) {
    const props: StatusElementProps = partialprops as StatusElementProps;
    this.type = 'execution_status';
    this.id = props.id;
    this.workflow_step = props.workflow_step;
    this.start_time = props.start_time;
    this.status = props.status;
    this.executed_by = props.executed_by;
    this.command_b64 = props.command_b64;
    this.notes = props.notes;
    this.automated_execution = props.automated_execution;
  }
}
