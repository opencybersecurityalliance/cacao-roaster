export interface PlaybookProcessingSummaryProps {
  manual_playbook: boolean;
  external_playbooks: boolean;
  parallel_processing: boolean;
  if_logic: boolean;
  while_logic: boolean;
  switch_logic: boolean;
  temporal_logic: boolean;
  data_markings: boolean;
  digital_signatures: boolean;
  countersigned_signature: boolean;
  extensions: boolean;
}

export interface PlaybookProcessingSummary
  extends PlaybookProcessingSummaryProps {}
export class PlaybookProcessingSummary {
  constructor(partialprops: Partial<PlaybookProcessingSummaryProps> = {}) {
    const props: PlaybookProcessingSummaryProps =
      partialprops as PlaybookProcessingSummaryProps;
    this.manual_playbook = props.manual_playbook;
    this.external_playbooks = props.external_playbooks;
    this.parallel_processing = props.parallel_processing;
    this.if_logic = props.if_logic;
    this.while_logic = props.while_logic;
    this.switch_logic = props.switch_logic;
    this.temporal_logic = props.temporal_logic;
    this.data_markings = props.data_markings;
    this.digital_signatures = props.digital_signatures;
    this.countersigned_signature = props.countersigned_signature;
    this.extensions = props.extensions;
  }
}
