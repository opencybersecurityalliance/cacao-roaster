import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface OnFailureConnectionExtensionProps
  extends ConnectionExtensionProps {}

export interface OnFailureConnectionExtension
  extends OnFailureConnectionExtensionProps {}
export class OnFailureConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<OnFailureConnectionExtensionProps> = {}) {
    const props: OnFailureConnectionExtensionProps =
      partialprops as OnFailureConnectionExtensionProps;
    super(props);
    this.type = 'on_failure';
  }
}
