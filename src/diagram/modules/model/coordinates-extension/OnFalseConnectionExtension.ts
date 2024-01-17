import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface OnFalseConnectionExtensionProps
  extends ConnectionExtensionProps {}

export interface OnFalseConnectionExtension
  extends OnFalseConnectionExtensionProps {}
export class OnFalseConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<OnFalseConnectionExtensionProps> = {}) {
    const props: OnFalseConnectionExtensionProps =
      partialprops as OnFalseConnectionExtensionProps;
    super(props);
    this.type = 'on_false';
  }
}
