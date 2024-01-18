import { CommandData, CommandDataProps } from './CommandData';

export interface YaraProps extends CommandDataProps {
  command_b64: string;
}

export interface Yara extends YaraProps {}
export class Yara extends CommandData {
  constructor(partialprops: Partial<YaraProps> = {}) {
    const props: YaraProps = partialprops as YaraProps;
    super(props);
    this.type = 'yara';
    this.command_b64 = props.command_b64;
  }
}
