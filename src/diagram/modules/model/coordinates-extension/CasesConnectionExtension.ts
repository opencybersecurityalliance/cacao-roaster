import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface CasesConnectionExtensionProps
  extends ConnectionExtensionProps {
  case: string;
}

export interface CasesConnectionExtension
  extends CasesConnectionExtensionProps {}
export class CasesConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<CasesConnectionExtensionProps> = {}) {
    const props: CasesConnectionExtensionProps =
      partialprops as CasesConnectionExtensionProps;
    super(props);
    this.type = 'cases';
    this.case = props.case;
  }
}
