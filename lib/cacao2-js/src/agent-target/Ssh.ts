import { Identifier } from '../data-types/Identifier';
import { AgentTarget, AgentTargetProps } from './AgentTarget';

enum address_enum {
  dname = 'dname',
  ipv4 = 'ipv4',
  ipv6 = 'ipv6',
  l2mac = 'l2mac',
  vlan = 'vlan',
  url = 'url',
}
export interface SshProps extends AgentTargetProps {
  address: {
    [key in address_enum]: string[];
  };
  port: string;
  authentication_info: Identifier;
  category: string[];
}

export interface Ssh extends SshProps {}
export class Ssh extends AgentTarget {
  constructor(partialprops: Partial<SshProps> = {}) {
    const props: SshProps = partialprops as SshProps;
    super(props);
    this.type = 'ssh';
    this.address = Object.assign({}, props.address);
    this.authentication_info = props.authentication_info;
    this.port = props.port;
    this.category = [];
    if (props.category) {
      this.category = Array.from(props.category);
    }
  }
}
