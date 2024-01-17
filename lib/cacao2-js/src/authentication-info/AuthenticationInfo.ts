import { Identifier } from '../data-types/Identifier';

export interface AuthenticationInfoProps {
  type: string;
  name: string;
  description: string;
  authentication_info_extensions: {
    [k: Identifier]: any;
  };
}

export interface AuthenticationInfo extends AuthenticationInfoProps {}
export class AuthenticationInfo {
  constructor(partialprops: Partial<AuthenticationInfoProps> = {}) {
    const props: AuthenticationInfoProps =
      partialprops as AuthenticationInfoProps;
    this.type = props.type;
    this.name = props.name;
    this.description = props.description;
    this.authentication_info_extensions = Object.assign(
      {},
      props.authentication_info_extensions,
    );
  }
}
