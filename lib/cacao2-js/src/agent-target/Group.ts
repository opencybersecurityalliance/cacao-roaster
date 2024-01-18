import { Contact } from '../data-types/Contact';
import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface GroupProps extends AgentTargetProps {
  contact: Contact;
}

export interface Group extends GroupProps {}

export class Group extends AgentTarget {
  constructor(partialprops: Partial<GroupProps> = {}) {
    const props: GroupProps = partialprops as GroupProps;
    super(props);
    this.type = 'group';
    if (props.contact) {
      this.contact = new Contact(props.contact);
    }
  }
}
