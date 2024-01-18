import { Contact } from '../data-types/Contact';
import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface OrganizationProps extends AgentTargetProps {
  contact: Contact;
}

export interface Organization extends OrganizationProps {}
export class Organization extends AgentTarget {
  constructor(partialprops: Partial<OrganizationProps> = {}) {
    const props: OrganizationProps = partialprops as OrganizationProps;
    super(props);
    this.type = 'organization';
    if (props.contact) {
      this.contact = new Contact(props.contact);
    }
  }
}
