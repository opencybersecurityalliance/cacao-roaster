import { Identifier } from '../data-types/Identifier';
import { ExternalReference } from '../data-types/ExternalReference';
import { Timestamp } from '../data-types/Timestamp';

export interface DataMarkingProps {
  type: 'marking-statement' | 'marking-tlp' | 'marking-iep';
  id: Identifier;
  name: string;
  description: string;
  created_by: Identifier;
  created: Timestamp;
  revoked: boolean;
  valid_from: Timestamp;
  valid_until: Timestamp;
  labels: string[];
  external_references: ExternalReference[];
  marking_extensions: {
    [k: string]: any;
  };
}

export interface DataMarking extends DataMarkingProps {}
export abstract class DataMarking {
  constructor(partialprops: Partial<DataMarkingProps> = {}) {
    const props: DataMarkingProps = partialprops as DataMarkingProps;
    this.type = props.type;
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.created_by = props.created_by;
    this.created = props.created;
    this.revoked = props.revoked;
    this.valid_from = props.valid_from;
    this.valid_until = props.valid_until;
    this.labels = [];
    if (props.labels) {
      this.labels = Array.from(props.labels);
    }
    this.external_references = [];
    if (props.external_references) {
      this.external_references = props.external_references.map(
        refs => new ExternalReference(refs),
      );
    }
  }
}
