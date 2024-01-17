import { Contact } from '../data-types/Contact';
import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface IndividualProps extends AgentTargetProps {
  contact: Contact;
}

export interface Individual extends IndividualProps {}
export class Individual extends AgentTarget {
  constructor(partialprops: Partial<IndividualProps> = {}) {
    const props: IndividualProps = partialprops as IndividualProps;
    super(props);
    this.type = 'individual';
    if (props.contact) {
      this.contact = new Contact(props.contact);
    }
  }
}
