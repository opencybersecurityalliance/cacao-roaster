import {
  AuthenticationInfo,
  AuthenticationInfoProps,
} from './AuthenticationInfo';
import { HttpBasic, HttpBasicProps } from './HttpBasic';
import { Oauth2, Oauth2Props } from './Oauth2';
import { UserAuth, UserAuthProps } from './UserAuth';

export abstract class AuthenticationInfoFactory {
  static create(props: Partial<AuthenticationInfoProps>): AuthenticationInfo {
    switch (props.type) {
      case 'http-basic':
        return new HttpBasic(props as HttpBasicProps);
      case 'oauth2':
        return new Oauth2(props as Oauth2Props);
      case 'user-auth':
        return new UserAuth(props as UserAuthProps);
      default:
        return new AuthenticationInfo(props as AuthenticationInfoProps);
    }
  }
}
