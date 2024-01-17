import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface OnTrueConnectionExtensionProps
  extends ConnectionExtensionProps {}

export interface OnTrueConnectionExtension
  extends OnTrueConnectionExtensionProps {}
export class OnTrueConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<OnTrueConnectionExtensionProps> = {}) {
    const props: OnTrueConnectionExtensionProps =
      partialprops as OnTrueConnectionExtensionProps;
    super(props);
    this.type = 'on_true';
  }
}
