import { CommandData, CommandDataProps } from './CommandData';

export interface SigmaProps extends CommandDataProps {
  command_b64: string;
}

export interface Sigma extends SigmaProps {}
export class Sigma extends CommandData {
  constructor(partialprops: Partial<SigmaProps> = {}) {
    const props: SigmaProps = partialprops as SigmaProps;
    super(props);
    this.type = 'sigma';
    this.command_b64 = props.command_b64;
  }
}
