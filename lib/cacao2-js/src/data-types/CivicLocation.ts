export interface CivicLocationProps {
  name: string;
  description: string;
  building_details: string;
  network_details: string;
  region: string;
  country: string;
  administrative_area: string;
  city: string;
  street_address: string;
  postal_code: string;
  latitude: string;
  longitude: string;
  precision: string;
}

export interface CivicLocation extends CivicLocationProps {}
export class CivicLocation {
  constructor(partialprops: Partial<CivicLocationProps> = {}) {
    const props: CivicLocationProps = partialprops as CivicLocationProps;
    this.name = props.name;
    this.description = props.description;
    this.building_details = props.building_details;
    this.network_details = props.network_details;
    this.region = props.region;
    this.country = props.country;
    this.administrative_area = props.administrative_area;
    this.city = props.city;
    this.street_address = props.street_address;
    this.postal_code = props.postal_code;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.precision = props.precision;
  }
}
