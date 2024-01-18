import { Identifier } from './Identifier';

export interface ExternalReferenceProps {
  name: string;
  description: string;
  source: string;
  url: string;
  external_id: string;
  reference_id: string;
}

export interface ExternalReference extends ExternalReferenceProps {}
export class ExternalReference {
  constructor(partialprops: Partial<ExternalReferenceProps> = {}) {
    const props: ExternalReferenceProps =
      partialprops as ExternalReferenceProps;
    this.name = props.name;
    this.description = props.description;
    this.source = props.source;
    this.url = props.url;
    this.external_id = props.external_id;
    this.reference_id = props.reference_id;
  }
}
