import { CommandData, CommandDataProps } from './CommandData';

export interface KestrelProps extends CommandDataProps {
  command_b64: string;
}

export interface Kestrel extends KestrelProps {}
export class Kestrel extends CommandData {
  constructor(partialprops: Partial<KestrelProps> = {}) {
    const props: KestrelProps = partialprops as KestrelProps;
    super(props);
    this.type = 'kestrel';
    this.command_b64 = props.command_b64;
  }
}
