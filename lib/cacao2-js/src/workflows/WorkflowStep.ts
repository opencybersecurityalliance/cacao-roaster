import { ExternalReference } from '../data-types/ExternalReference';
import { Identifier } from '../data-types/Identifier';
import { Variable } from '../data-types/Variable';

export interface WorkflowStepProps {
  type:
    | 'start'
    | 'end'
    | 'action'
    | 'playbook-action'
    | 'parallel'
    | 'if-condition'
    | 'while-condition'
    | 'switch-condition';
  name: string;
  description: string;
  external_references: ExternalReference[];
  delay: number;
  timeout: number;
  step_variables: {
    [k: string]: Variable;
  };
  owner: Identifier;
  on_completion: Identifier;
  on_success: Identifier;
  on_failure: Identifier;
  step_extensions: {
    [k: Identifier]: any;
  };
}

export interface WorkflowStep extends WorkflowStepProps {}
export abstract class WorkflowStep {
  constructor(partialprops: Partial<WorkflowStepProps> = {}) {
    const props: WorkflowStepProps = partialprops as WorkflowStepProps;
    this.name = props.name;
    this.description = props.description;
    this.external_references = [];
    if (props.external_references) {
      this.external_references = props.external_references.map(
        refs => new ExternalReference(refs),
      );
    }
    this.delay = props.delay;
    this.timeout = props.timeout;
    this.step_variables = {};
    for (const id in props.step_variables) {
      const variable = props.step_variables[id];
      this.step_variables[id] = new Variable(variable);
    }
    this.owner = props.owner;
    this.on_completion = props.on_completion;
    this.on_success = props.on_success;
    this.on_failure = props.on_failure;
    this.step_extensions = Object.assign({}, props.step_extensions);
  }

  /**
   * Changes properties specific to the class that require more than an assigment
   *
   * @param props All the properties susceptible to update the object
   * @param prop One of the properties
   * @returns A boolean that indicates if a property has been changed
   */
  protected updateObjectProperty(props: any, prop: any): boolean {
    if (prop === 'external_references' && props.external_references) {
      this.external_references = props.external_references.map(
        (refs: any) => new ExternalReference(refs),
      );
      return true;
    } else if (prop === 'step_extensions' && props.step_extensions) {
      this.step_extensions = Object.assign({}, props.step_extensions);
      return true;
    }
    return false;
  }

  update(props: Partial<any>): void {
    for (const prop in props) {
      if (
        props.hasOwnProperty(prop) &&
        props[prop as keyof WorkflowStepProps] !== undefined &&
        prop in this
      ) {
        if (!this.updateObjectProperty(props, prop)) {
          if (Array.isArray(props[prop as keyof WorkflowStepProps])) {
            (this as any)[prop] = Array.from(
              props[prop as keyof WorkflowStepProps] as any,
            );
          } else {
            (this as any)[prop] = props[prop as keyof WorkflowStepProps];
          }
        }
      }
    }
  }
}
