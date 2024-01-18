import { ExternalReference } from '../data-types/ExternalReference';
import { Identifier } from '../data-types/Identifier';

export interface ExtensionDefinitionProps {
  type: string;
  name: string;
  description: string;
  created_by: Identifier;
  schema: string;
  version: string;
  external_references: ExternalReference[];
}

export interface ExtensionDefinition extends ExtensionDefinitionProps {}
export class ExtensionDefinition {
  constructor(partialprops: Partial<ExtensionDefinitionProps> = {}) {
    const props: ExtensionDefinitionProps =
      partialprops as ExtensionDefinitionProps;
    this.type = 'extension-definition';
    this.name = props.name;
    this.description = props.description;
    this.created_by = props.created_by;
    this.schema = props.schema;
    this.version = props.version;
    this.external_references = [];
    if (props.external_references) {
      this.external_references = props.external_references.map(
        refs => new ExternalReference(refs),
      );
    }
  }
  update(props: Partial<ExtensionDefinitionProps>): void {
    for (const prop in props) {
      if (
        props.hasOwnProperty(prop) &&
        props[prop as keyof ExtensionDefinitionProps] !== undefined &&
        props[prop as keyof ExtensionDefinitionProps] !== '' &&
        prop in this
      ) {
        (this as any)[prop] = props[prop as keyof ExtensionDefinitionProps];
      }
    }
  }
}
