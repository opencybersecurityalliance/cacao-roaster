import { CommandData, CommandDataProps } from './CommandData';

export interface ManualProps extends CommandDataProps {
  command: string;
  command_b64: string;
}

export interface Manual extends ManualProps {}
export class Manual extends CommandData {
  constructor(partialprops: Partial<ManualProps> = {}) {
    const props: ManualProps = partialprops as ManualProps;
    super(props);
    this.type = 'manual';
    this.command = props.command;
    this.command_b64 = props.command_b64;
  }
}
