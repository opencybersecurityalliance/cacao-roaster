import { CommandData, CommandDataProps } from './CommandData';

export interface PowershellProps extends CommandDataProps {
  command: string;
  command_b64: string;
}

export interface Powershell extends PowershellProps {}
export class Powershell extends CommandData {
  constructor(partialprops: Partial<PowershellProps> = {}) {
    const props: PowershellProps = partialprops as PowershellProps;
    super(props);
    this.type = 'powershell';
    this.command = props.command;
    this.command_b64 = props.command_b64;
  }
}
