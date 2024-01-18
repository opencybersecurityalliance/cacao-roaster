import { CivicLocation } from '../data-types/CivicLocation';
import { Identifier } from '../data-types/Identifier';

export interface AgentTargetProps {
  type: string;
  name: string;
  description: string;
  location: CivicLocation;
  agent_target_extensions: {
    [k: Identifier]: any;
  };
}

export interface AgentTarget extends AgentTargetProps {}
export class AgentTarget {
  constructor(partialprops: Partial<AgentTargetProps> = {}) {
    const props: AgentTargetProps = partialprops as AgentTargetProps;
    this.type = props.type;
    this.name = props.name;
    this.description = props.description;
    if (props.location) {
      this.location = new CivicLocation(props.location);
    }
    this.agent_target_extensions = Object.assign(
      {},
      props.agent_target_extensions,
    );
  }
}
