import {
  AuthenticationInfo,
  AuthenticationInfoProps,
} from './AuthenticationInfo';

export interface HttpBasicProps extends AuthenticationInfoProps {
  user_id: string;
  password: string;
  kms: boolean;
  kms_key_identifier: string;
}

export interface HttpBasic extends HttpBasicProps {}
export class HttpBasic extends AuthenticationInfo {
  constructor(partialprops: Partial<HttpBasicProps> = {}) {
    const props: HttpBasicProps = partialprops as HttpBasicProps;
    super(props);
    this.type = 'http-basic';
    this.user_id = props.user_id;
    this.password = props.password;
    this.kms = props.kms;
    this.kms_key_identifier = props.kms_key_identifier;
  }
}
