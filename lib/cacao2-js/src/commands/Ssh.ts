import { CommandData, CommandDataProps } from './CommandData';

export interface SshProps extends CommandDataProps {
  command: string;
  command_b64: string;
}

export interface Ssh_cmd extends SshProps {}
export class Ssh_cmd extends CommandData {
  constructor(partialprops: Partial<SshProps> = {}) {
    const props: SshProps = partialprops as SshProps;
    super(props);
    this.type = 'ssh';
    this.command = props.command;
    this.command_b64 = props.command_b64;
  }
}
