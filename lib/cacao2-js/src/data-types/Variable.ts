export interface VariableProps {
  type: string;
  description: string;
  value: string | '' | null;
  constant: boolean;
  external: boolean;
}

export interface Variable extends VariableProps {}
export class Variable {
  constructor(partialprops: Partial<VariableProps> = {}) {
    const props: VariableProps = partialprops as VariableProps;
    this.type = props.type;
    this.description = props.description;
    this.value = props.value;
    this.constant = props.constant;
    this.external = props.external;
  }
}
