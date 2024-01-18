import { ExternalReference } from '../data-types/ExternalReference';

export interface CommandDataProps {
  type: string;
  description: string;
  version: string;
  playbook_activity: string;
  external_references: ExternalReference[];
}

export interface CommandData extends CommandDataProps {}
export class CommandData {
  constructor(partialprops: Partial<CommandDataProps> = {}) {
    const props: CommandDataProps = partialprops as CommandDataProps;
    this.type = props.type;
    this.description = props.description;
    this.version = props.version;
    this.playbook_activity = props.playbook_activity;
    this.external_references = [];
    if (props.external_references) {
      this.external_references = props.external_references.map(
        refs => new ExternalReference(refs),
      );
    }
  }
}
