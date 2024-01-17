import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface OnSuccessConnectionExtensionProps
  extends ConnectionExtensionProps {}

export interface OnSuccessConnectionExtension
  extends OnSuccessConnectionExtensionProps {}
export class OnSuccessConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<OnSuccessConnectionExtensionProps> = {}) {
    const props: OnSuccessConnectionExtensionProps =
      partialprops as OnSuccessConnectionExtensionProps;
    super(props);
    this.type = 'on_success';
  }
}
