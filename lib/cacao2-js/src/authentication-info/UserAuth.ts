import {
  AuthenticationInfo,
  AuthenticationInfoProps,
} from './AuthenticationInfo';

export interface UserAuthProps extends AuthenticationInfoProps {
  username: string;
  password: string;
  kms: boolean;
  kms_key_identifier: string;
}

export interface UserAuth extends UserAuthProps {}
export class UserAuth extends AuthenticationInfo {
  constructor(partialprops: Partial<UserAuthProps> = {}) {
    const props: UserAuthProps = partialprops as UserAuthProps;
    super(props);
    this.type = 'user-auth';
    this.username = props.username;
    this.password = props.password;
    this.kms = props.kms;
    this.kms_key_identifier = props.kms_key_identifier;
  }
}
