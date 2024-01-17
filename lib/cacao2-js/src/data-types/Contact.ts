export interface ContactProps {
  email: {
    [k: string]: string;
  };
  phone: {
    [k: string]: string;
  };
  contact_details: string;
}

export interface Contact extends ContactProps {}
export class Contact {
  constructor(partialprops: Partial<ContactProps> = {}) {
    const props: ContactProps = partialprops as ContactProps;
    this.email = props.email;
    this.phone = props.phone;
    this.contact_details = props.contact_details;
  }
}
