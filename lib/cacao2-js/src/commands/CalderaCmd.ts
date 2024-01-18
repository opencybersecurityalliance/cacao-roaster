import { CommandData, CommandDataProps } from './CommandData';

export interface CalderaCmdProps extends CommandDataProps {
  command: string;
  command_b64: string;
}

export interface CalderaCmd extends CalderaCmdProps {}
export class CalderaCmd extends CommandData {
  constructor(partialprops: Partial<CalderaCmdProps> = {}) {
    const props: CalderaCmdProps = partialprops as CalderaCmdProps;
    super(props);
    this.type = 'caldera-cmd';
    this.command = props.command;
    this.command_b64 = props.command_b64;
  }
}
