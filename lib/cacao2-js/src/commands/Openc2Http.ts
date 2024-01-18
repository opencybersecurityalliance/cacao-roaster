import { CommandData, CommandDataProps } from './CommandData';

export interface Openc2HttpProps extends CommandDataProps {
  command: string;
  content_b64: string;
  headers: {
    [k: string]: string[];
  };
}

export interface Openc2Http extends Openc2HttpProps {}
export class Openc2Http extends CommandData {
  constructor(partialprops: Partial<Openc2HttpProps> = {}) {
    const props: Openc2HttpProps = partialprops as Openc2HttpProps;
    super(props);
    this.type = 'openc2-http';
    this.command = props.command;
    this.content_b64 = props.content_b64;
    this.headers = {};
    for (const key in props.headers) {
      this.headers[key] = Array.from(props.headers[key]);
    }
  }
}
