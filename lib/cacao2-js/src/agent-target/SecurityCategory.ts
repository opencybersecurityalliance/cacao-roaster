import { AgentTarget, AgentTargetProps } from './AgentTarget';

export interface SecurityCategoryProps extends AgentTargetProps {
  category: string[];
}

export interface SecurityCategory extends SecurityCategoryProps {}
export class SecurityCategory extends AgentTarget {
  constructor(partialprops: Partial<SecurityCategoryProps> = {}) {
    const props: SecurityCategoryProps = partialprops as SecurityCategoryProps;
    super(props);
    this.type = 'security-category';
    this.category = [];
    if (props.category) {
      this.category = Array.from(props.category);
    }
  }
}
