import { CommandData, CommandDataProps } from './CommandData';

export interface HttpApiProps extends CommandDataProps {
  command: string;
  content: string;
  content_b64: string;
  headers: {
    [k: string]: string[];
  };
}

export interface HttpApi_cmd extends HttpApiProps {}
export class HttpApi_cmd extends CommandData {
  constructor(partialprops: Partial<HttpApiProps> = {}) {
    const props: HttpApiProps = partialprops as HttpApiProps;
    super(props);
    this.type = 'http-api';
    this.command = props.command;
    this.content = props.content;
    this.content_b64 = props.content_b64;
    this.headers = {};
    for (const key in props.headers) {
      this.headers[key] = Array.from(props.headers[key]);
    }
  }
}
