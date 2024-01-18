import { CommandData, CommandDataProps } from './CommandData';

export interface BashProps extends CommandDataProps {
  command: string;
  command_b64: string;
}

export interface Bash extends BashProps {}
export class Bash extends CommandData {
  constructor(partialprops: Partial<BashProps> = {}) {
    const props: BashProps = partialprops as BashProps;
    super(props);
    this.type = 'bash';
    this.command = props.command;
    this.command_b64 = props.command_b64;
  }
}
