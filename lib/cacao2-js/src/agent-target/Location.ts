import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface LocationProps extends AgentTargetProps {
  logical: string[];
}

export interface Location extends LocationProps {}
export class Location extends AgentTarget {
  constructor(partialprops: Partial<LocationProps> = {}) {
    const props: LocationProps = partialprops as LocationProps;
    super(props);
    this.type = 'location';
    this.logical = [];
    if (props.logical) {
      this.logical = Array.from(props.logical);
    }
  }
}
