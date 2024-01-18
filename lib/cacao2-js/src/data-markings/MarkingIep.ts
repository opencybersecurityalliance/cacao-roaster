import { Timestamp } from '../data-types/Timestamp';
import { DataMarking, DataMarkingProps } from './DataMarking';

export interface MarkingIepProps
  extends Omit<DataMarkingProps, 'external_references'> {
  name: string;
  tlp_level: string;
  description: string;
  iep_version: string;
  start_date: Timestamp;
  end_date: Timestamp | null;
  encrypt_in_transit: string;
  permitted_actions: string;
  affected_party_notification: string;
  attribution: string;
  unmodified_resale: string;
  external_references: string[];
}

export interface MarkingIep extends MarkingIepProps {}
export class MarkingIep implements MarkingIepProps {
  constructor(partialprops: Partial<MarkingIepProps> = {}) {
    const props: MarkingIepProps = partialprops as MarkingIepProps;
    this.type = 'marking-iep';
    this.name = props.name;
    this.description = props.description;
    this.tlp_level = props.tlp_level;
    this.iep_version = props.iep_version;
    this.start_date = props.start_date;
    this.end_date = props.end_date;
    this.encrypt_in_transit = props.encrypt_in_transit;
    this.permitted_actions = props.permitted_actions;
    this.attribution = props.attribution;
    this.unmodified_resale = props.unmodified_resale;
    this.external_references = [];
    if (props.external_references) {
      this.external_references = Array.from(props.external_references);
    }
  }
}
