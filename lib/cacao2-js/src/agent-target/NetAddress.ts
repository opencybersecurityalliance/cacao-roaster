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

export interface NetAddressProps extends AgentTargetProps {
  address: {
    [key in address_enum]: string[];
  };
  authentication_info: Identifier;
  category: string[];
}

export interface NetAddress extends NetAddressProps {}
export class NetAddress extends AgentTarget {
  constructor(partialprops: Partial<NetAddressProps> = {}) {
    const props: NetAddressProps = partialprops as NetAddressProps;
    super(props);
    this.type = 'net-address';
    this.address = Object.assign({}, props.address);
    this.authentication_info = props.authentication_info;
    this.category = [];
    if (props.category) {
      this.category = Array.from(props.category);
    }
  }
}
