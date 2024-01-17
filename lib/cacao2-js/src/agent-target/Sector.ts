import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface SectorProps extends AgentTargetProps {
  sector: string;
}

export interface Sector extends SectorProps {}
export class Sector extends AgentTarget {
  constructor(partialprops: Partial<SectorProps> = {}) {
    const props: SectorProps = partialprops as SectorProps;
    super(props);
    this.type = 'sector';
    this.sector = this.sector;
  }
}
