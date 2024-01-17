import { ConnectionExtension } from './ConnectionExtension';
import { ConnectionExtensionFactory } from './ConnectionExtensionFactory';

export interface CoordinatesExtensionProps {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  outgoing_connections: ConnectionExtension[];
}

export interface CoordinatesExtension extends CoordinatesExtensionProps {}
export class CoordinatesExtension {
  constructor(partialprops: Partial<CoordinatesExtensionProps> = {}) {
    const props: CoordinatesExtensionProps =
      partialprops as CoordinatesExtensionProps;
    this.type = 'coordinates';
    this.x = props.x;
    this.y = props.y;
    this.width = props.width;
    this.height = props.height;
    this.outgoing_connections = [];
    if (props.outgoing_connections) {
      this.outgoing_connections = props.outgoing_connections.map(conn =>
        ConnectionExtensionFactory.create(conn),
      );
    }
  }
}
