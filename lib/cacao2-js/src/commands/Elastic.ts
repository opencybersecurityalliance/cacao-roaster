import { CommandData, CommandDataProps } from './CommandData';

export interface ElasticProps extends CommandDataProps {
  command_b64: string;
}

export interface Elastic extends ElasticProps {}
export class Elastic extends CommandData {
  constructor(partialprops: Partial<ElasticProps> = {}) {
    const props: ElasticProps = partialprops as ElasticProps;
    super(props);
    this.type = 'elastic';
    this.command_b64 = props.command_b64;
  }
}
