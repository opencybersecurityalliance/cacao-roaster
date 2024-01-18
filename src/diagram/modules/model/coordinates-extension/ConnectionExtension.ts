export interface ConnectionExtensionProps {
  type:
    | 'on_completion'
    | 'on_success'
    | 'on_failure'
    | 'on_true'
    | 'on_false'
    | 'cases'
    | 'next_steps';
  x: number[];
  y: number[];
}

export interface ConnectionExtension extends ConnectionExtensionProps {}
export class ConnectionExtension {
  constructor(partialprops: Partial<ConnectionExtensionProps> = {}) {
    const props: ConnectionExtensionProps =
      partialprops as ConnectionExtensionProps;
    this.type = props.type;
    this.x = [];
    if (props.x) {
      this.x = Array.from(props.x);
    }
    this.y = [];
    if (props.y) {
      this.y = Array.from(props.y);
    }
  }
}
