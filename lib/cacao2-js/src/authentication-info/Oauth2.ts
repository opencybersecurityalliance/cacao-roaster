import {
  AuthenticationInfo,
  AuthenticationInfoProps,
} from './AuthenticationInfo';

export interface Oauth2Props extends AuthenticationInfoProps {
  oauth_header: string;
  token: string;
  kms: boolean;
  kms_key_identifier: string;
}

export interface Oauth2 extends Oauth2Props {}
export class Oauth2 extends AuthenticationInfo {
  constructor(partialprops: Partial<Oauth2Props> = {}) {
    const props: Oauth2Props = partialprops as Oauth2Props;
    super(props);
    this.type = 'oauth2';
    this.oauth_header = props.oauth_header;
    this.token = props.token;
    this.kms = props.kms;
    this.kms_key_identifier = props.kms_key_identifier;
  }
}
