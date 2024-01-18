import { Identifier } from 'lib/cacao2-js/src/data-types/Identifier';
import {
  ConnectionExtension,
  ConnectionExtensionProps,
} from './ConnectionExtension';

export interface NextStepsConnectionExtensionProps
  extends ConnectionExtensionProps {
  next_step: Identifier;
}

export interface NextStepsConnectionExtension
  extends NextStepsConnectionExtensionProps {}
export class NextStepsConnectionExtension extends ConnectionExtension {
  constructor(partialprops: Partial<NextStepsConnectionExtensionProps> = {}) {
    const props: NextStepsConnectionExtensionProps =
      partialprops as NextStepsConnectionExtensionProps;
    super(props);
    this.type = 'next_steps';
    this.next_step = props.next_step;
  }
}
