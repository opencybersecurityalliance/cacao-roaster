import { AgentTarget } from './agent-target/AgentTarget';
import { ExternalReference } from './data-types/ExternalReference';
import { Identifier } from './data-types/Identifier';
import { PlaybookProcessingSummary } from './data-types/PlaybookProcessingSummary';
import { Signature } from './data-types/Signature';
import { Timestamp } from './data-types/Timestamp';
import { Variable } from './data-types/Variable';
import { ExtensionDefinition } from './extension-definition/ExtensionDefinition';
import { WorkflowStep } from './workflows/WorkflowStep';
import { WorkflowStepFactory } from './workflows/WorkflowStepFactory';
import { AgentTargetFactory } from './agent-target/AgentTargetFactory';
import { DataMarking } from './data-markings/DataMarking';
import { DataMarkingFactory } from './data-markings/DataMarkingFactory';
import { AuthenticationInfo } from './authentication-info/AuthenticationInfo';
import { AuthenticationInfoFactory } from './authentication-info/AuthenticationInfoFactory';

export interface PlaybookProps {
  type: 'playbook';
  spec_version: 'cacao-2.0';
  id: Identifier;
  name: string;
  description: string;
  playbook_types: string[];
  playbook_activities: string[];
  playbook_processing_summary: Partial<PlaybookProcessingSummary>;
  created_by: Identifier;
  created: Timestamp;
  modified: Timestamp;
  revoked: boolean;
  valid_from: Timestamp;
  valid_until: Timestamp;
  derived_from: Identifier[];
  related_to: Identifier[];
  priority: number;
  severity: number;
  impact: number;
  industry_sectors: string[];
  labels: string[];
  external_references: ExternalReference[];
  markings: Identifier[];
  playbook_variables: {
    [k: string]: Partial<Variable>;
  };
  workflow_start: Identifier;
  workflow_exception: Identifier;
  workflow: {
    [k: Identifier]: Partial<WorkflowStep>;
  };
  playbook_extensions: {
    [k: Identifier]: object;
  };
  authentication_info_definitions: {
    [k: Identifier]: Partial<AuthenticationInfo>;
  };
  agent_definitions: {
    [k: Identifier]: Partial<AgentTarget>;
  };
  target_definitions: {
    [k: Identifier]: Partial<AgentTarget>;
  };
  extension_definitions: {
    [k: Identifier]: Partial<ExtensionDefinition>;
  };
  data_marking_definitions: {
    [k: Identifier]: Partial<DataMarking>;
  };
  signatures: Signature[];
}

export interface Playbook extends PlaybookProps {}
export class Playbook {
  constructor(partialprops: Partial<PlaybookProps> = {}) {
    const props: PlaybookProps = partialprops as PlaybookProps;
    this.type = 'playbook';
    this.spec_version = 'cacao-2.0';
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.playbook_types = [];
    if (props.playbook_types) {
      this.playbook_types = Array.from(props.playbook_types);
    }
    this.playbook_activities = [];
    if (props.playbook_activities) {
      this.playbook_activities = Array.from(props.playbook_activities);
    }
    this.playbook_processing_summary = {};
    if (props.playbook_processing_summary) {
      this.playbook_processing_summary = new PlaybookProcessingSummary(
        props.playbook_processing_summary,
      );
    }
    this.created_by = props.created_by;
    this.created = props.created;
    this.modified = props.modified;
    this.revoked = props.revoked;
    this.valid_from = props.valid_from;
    this.valid_until = props.valid_until;
    this.derived_from = [];
    this.related_to = [];
    if (props.derived_from) {
      this.derived_from = Array.from(props.derived_from);
    }
    this.priority = props.priority;
    this.severity = props.severity;
    this.impact = props.impact;
    this.industry_sectors = [];
    if (props.industry_sectors) {
      this.industry_sectors = Array.from(props.industry_sectors);
    }
    this.labels = [];
    if (props.labels) {
      this.labels = Array.from(props.labels);
    }
    this.external_references = [];
    if (props.external_references) {
      this.external_references = props.external_references.map(
        refs => new ExternalReference(refs),
      );
    }
    this.markings = [];
    if (props.markings) {
      this.markings = Array.from(props.markings);
    }
    this.playbook_variables = {};
    for (const id in props.playbook_variables) {
      const variable = props.playbook_variables[id];
      this.playbook_variables[id] = new Variable(variable);
    }
    this.workflow_start = props.workflow_start;
    this.workflow_exception = props.workflow_exception;
    this.workflow = {};
    for (const id in props.workflow) {
      const step = props.workflow[id];
      this.workflow[id] = WorkflowStepFactory.create(step);
    }
    this.playbook_extensions = {};
    for (const id in props.playbook_extensions) {
      const extension = props.playbook_extensions[id];
      this.playbook_extensions[id] = extension;
    }
    this.authentication_info_definitions = {};
    for (const id in props.authentication_info_definitions) {
      const auth = props.authentication_info_definitions[id];
      this.authentication_info_definitions[id] =
        AuthenticationInfoFactory.create(auth);
    }
    this.agent_definitions = {};
    for (const id in props.agent_definitions) {
      const agent = props.agent_definitions[id];
      this.agent_definitions[id] = AgentTargetFactory.create(agent);
    }
    this.target_definitions = {};
    for (const id in props.target_definitions) {
      const target = props.target_definitions[id];
      this.target_definitions[id] = AgentTargetFactory.create(target);
    }
    this.extension_definitions = {};
    for (const id in props.extension_definitions) {
      const extension = props.extension_definitions[id];
      this.extension_definitions[id] = new ExtensionDefinition(extension);
    }
    this.data_marking_definitions = {};
    for (const id in props.data_marking_definitions) {
      let marking = props.data_marking_definitions[id];
      marking = DataMarkingFactory.create(marking);
      if (marking && marking.id) {
        this.data_marking_definitions[marking.id] = marking;
      }
    }
    this.signatures = [];
    if (props.signatures) {
      this.signatures = props.signatures.map(
        signature => new Signature(signature),
      );
    }
  }

  private updateObjectProperty(props: any, prop: any): boolean {
    if (prop === 'external_references' && props.external_references) {
      this.external_references = props.external_references.map(
        (refs: any) => new ExternalReference(refs),
      );
      return true;
    } else if (prop === 'workflow' && props.workflow) {
      this.workflow = {};
      for (const id in props.workflow) {
        const step = props.workflow[id];
        this.workflow[id] = WorkflowStepFactory.create(step);
      }
      return true;
    } else if (prop === 'agent_definitions' && props.agent_definitions) {
      this.agent_definitions = {};
      for (const id in props.agent_definitions) {
        const agent = props.agent_definitions[id];
        this.agent_definitions[id] = AgentTargetFactory.create(agent);
      }
      return true;
    } else if (prop === 'target_definitions' && props.target_definitions) {
      this.target_definitions = {};
      for (const id in props.target_definitions) {
        const target = props.target_definitions[id];
        this.target_definitions[id] = AgentTargetFactory.create(target);
      }
      return true;
    } else if (
      prop === 'extension_definitions' &&
      props.extension_definitions
    ) {
      this.extension_definitions = {};
      for (const id in props.extension_definitions) {
        const extension = props.extension_definitions[id];
        this.extension_definitions[id] = new ExtensionDefinition(extension);
      }
      return true;
    } else if (
      prop === 'data_marking_definitions' &&
      props.data_marking_definitions
    ) {
      this.data_marking_definitions = {};
      for (const id in props.data_marking_definitions) {
        let marking = props.data_marking_definitions[id];
        marking = DataMarkingFactory.create(marking);
        marking.id = id;
        this.data_marking_definitions[marking.id] = marking;
      }
      return true;
    } else if (prop === 'playbook_extensions' && props.playbook_extensions) {
      this.playbook_extensions = {};
      for (const id in props.playbook_extensions) {
        const extension = props.playbook_extensions[id];
        this.playbook_extensions[id] = extension;
      }
    } else if (
      prop === 'authentication_info_definitions' &&
      props.authentication_info_definitions
    ) {
      this.authentication_info_definitions = {};
      for (const id in props.authentication_info_definitions) {
        const auth_info = props.authentication_info_definitions[id];
        this.authentication_info_definitions[id] = auth_info;
      }
    }
    return false;
  }

  update(props: Partial<PlaybookProps>): void {
    for (const prop in props) {
      if (
        props.hasOwnProperty(prop) &&
        props[prop as keyof PlaybookProps] !== undefined &&
        prop in this
      ) {
        if (!this.updateObjectProperty(props, prop)) {
          if (Array.isArray(props[prop as keyof PlaybookProps])) {
            (this as any)[prop] = Array.from(
              props[prop as keyof PlaybookProps] as any,
            );
          } else {
            (this as any)[prop] = props[prop as keyof PlaybookProps];
          }
        }
      }
    }
  }
}
