import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface OnCompletionConnectionExtensionProps
  extends ConnectionExtensionProps {}

export interface OnCompletionConnectionExtension
  extends OnCompletionConnectionExtensionProps {}
export class OnCompletionConnectionExtension extends ConnectionExtension {
  constructor(
    partialprops: Partial<OnCompletionConnectionExtensionProps> = {},
  ) {
    const props: OnCompletionConnectionExtensionProps =
      partialprops as OnCompletionConnectionExtensionProps;
    super(props);
    this.type = 'on_completion';
  }
}
