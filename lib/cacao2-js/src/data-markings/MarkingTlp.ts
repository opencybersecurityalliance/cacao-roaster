import { DataMarking, DataMarkingProps } from './DataMarking';

export interface MarkingTlpProps extends DataMarkingProps {
  tlpv2_level:
    | 'TLP:RED'
    | 'TLP:AMBER'
    | 'TLP:AMBER+STRICT'
    | 'TLP:GREEN'
    | 'TLP:CLEAR';
}

export interface MarkingTlp extends MarkingTlpProps {}
export class MarkingTlp extends DataMarking {
  constructor(partialprops: Partial<MarkingTlpProps> = {}) {
    const props: MarkingTlpProps = partialprops as MarkingTlpProps;
    super(props);
    this.type = 'marking-tlp';
    this.tlpv2_level = props.tlpv2_level;
    this.setStandardTLPData();
  }

  setStandardTLPData() {
    switch (this.tlpv2_level) {
      case 'TLP:CLEAR':
        this.type = 'marking-tlp';
        this.id = 'marking-tlp--94868c89-83c2-464b-929b-a1a8aa3c8487';
        this.created_by = 'identity--5abe695c-7bd5-4c31-8824-2528696cdbf1';
        this.created = '2022-10-01T00:00:00.000Z';
        this.tlpv2_level = 'TLP:CLEAR';
        break;
      case 'TLP:GREEN':
        this.type = 'marking-tlp';
        this.id = 'marking-tlp--bab4a63c-aed9-4cf5-a766-dfca5abac2bb';
        this.created_by = 'identity--5abe695c-7bd5-4c31-8824-2528696cdbf1';
        this.created = '2022-10-01T00:00:00.000Z';
        this.tlpv2_level = 'TLP:GREEN';
        break;
      case 'TLP:AMBER':
        this.type = 'marking-tlp';
        this.id = 'marking-tlp--55d920b0-5e8b-4f79-9ee9-91f868d9b421';
        this.created_by = 'identity--5abe695c-7bd5-4c31-8824-2528696cdbf1';
        this.created = '2022-10-01T00:00:00.000Z';
        this.tlpv2_level = 'TLP:AMBER';
        break;
      case 'TLP:AMBER+STRICT':
        this.type = 'marking-tlp';
        this.id = 'marking-tlp--939a9414-2ddd-4d32-a0cd-375ea402b003';
        this.created_by = 'identity--5abe695c-7bd5-4c31-8824-2528696cdbf1';
        this.created = '2022-10-01T00:00:00.000Z';
        this.tlpv2_level = 'TLP:AMBER+STRICT';
        break;
      case 'TLP:RED':
        this.type = 'marking-tlp';
        this.id = 'marking-tlp--e828b379-4e03-4974-9ac4-e53a884c97c1';
        this.created_by = 'identity--5abe695c-7bd5-4c31-8824-2528696cdbf1';
        this.created = '2022-10-01T00:00:00.000Z';
        this.tlpv2_level = 'TLP:RED';
        break;
      default:
        throw new Error(
          `Unknown TLP level : ${this.tlpv2_level}. Valid TLP levels are : TLP:CLEAR, TLP:GREEN, TLP:AMBER, TLP:AMBER+STRICT, TLP:RED`,
        );
    }
  }
}
