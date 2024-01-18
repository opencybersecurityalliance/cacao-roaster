import { AgentTarget, AgentTargetProps } from './AgentTarget';
import { Group, GroupProps } from './Group';
import { HttpApi, HttpApiProps } from './HttpApi';
import { Individual, IndividualProps } from './Individual';
import { Linux, LinuxProps } from './Linux';
import { Location, LocationProps } from './Location';
import { NetAddress, NetAddressProps } from './NetAddress';
import { Organization, OrganizationProps } from './Organization';
import { Sector, SectorProps } from './Sector';
import { SecurityCategory, SecurityCategoryProps } from './SecurityCategory';
import { Ssh, SshProps } from './Ssh';

export abstract class AgentTargetFactory {
  static create(props: Partial<AgentTargetProps>): AgentTarget {
    switch (props.type) {
      case 'group':
        return new Group(props as GroupProps);
      case 'http-api':
        return new HttpApi(props as HttpApiProps);
      case 'individual':
        return new Individual(props as IndividualProps);
      case 'linux':
        return new Linux(props as LinuxProps);
      case 'location':
        return new Location(props as LocationProps);
      case 'net-address':
        return new NetAddress(props as NetAddressProps);
      case 'organization':
        return new Organization(props as OrganizationProps);
      case 'sector':
        return new Sector(props as SectorProps);
      case 'security-category':
        return new SecurityCategory(props as SecurityCategoryProps);
      case 'ssh':
        return new Ssh(props as SshProps);
      default:
        return new AgentTarget(props as AgentTargetProps);
    }
  }
}
