import { Identifier } from './Identifier';
import { Timestamp } from './Timestamp';
import { v4 as uuidv4 } from 'uuid';

export interface SignatureProps {
  type: string;
  id: Identifier;
  created_by: Identifier;
  created: Timestamp;
  modified: Timestamp;
  revoked: boolean;
  signee: string;
  valid_from: Timestamp;
  valid_until: Timestamp;
  related_to: Identifier;
  related_version: Timestamp;
  hash_algorithm: string;
  algorithm: string;
  public_key: string;
  public_cert_chain: string[];
  cert_url: string;
  thumbprint: string;
  value: string;
  signature: Signature;
}

export interface Signature extends SignatureProps {}
export class Signature {
  constructor(partialprops: Partial<SignatureProps> = {}) {
    const props: SignatureProps = partialprops as SignatureProps;
    this.type = 'jss';
    if (props.id == undefined || props.id == '') {
      this.id = 'jss--' + uuidv4();
    } else {
      this.id = props.id;
    }
    this.created_by = props.created_by;
    this.created = props.created;
    this.modified = props.modified;
    this.revoked = props.revoked;
    this.signee = props.signee;
    this.valid_from = props.valid_from;
    this.valid_until = props.valid_until;
    this.related_to = props.related_to;
    this.related_version = props.related_version;
    this.hash_algorithm = props.hash_algorithm;
    this.algorithm = props.algorithm;
    this.public_key = props.public_key;
    this.public_cert_chain = [];
    if (props.public_cert_chain) {
      this.public_cert_chain = Array.from(props.public_cert_chain);
    }
    this.cert_url = props.cert_url;
    this.thumbprint = props.thumbprint;
    this.value = props.value;
    if (props.signature) {
      this.signature = new Signature(props.signature);
    }
  }
}
