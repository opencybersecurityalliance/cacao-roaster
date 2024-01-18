import { DataMarking, DataMarkingProps } from './DataMarking';

export interface MarkingStatementProps extends DataMarkingProps {
  statement: string;
}

export interface MarkingStatement extends MarkingStatementProps {}
export class MarkingStatement extends DataMarking {
  constructor(partialprops: Partial<MarkingStatementProps> = {}) {
    const props: MarkingStatementProps = partialprops as MarkingStatementProps;
    super(props);
    this.type = 'marking-statement';
    this.statement = props.statement;
  }
}
