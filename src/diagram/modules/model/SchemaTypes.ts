// Agent Target JSON schema imports
import jsonSchemaAgentTarget from '../../../../lib/cacao-json-schemas/schemas/agent-target/agent-target.json';
import jsonSchemaGroup from '../../../../lib/cacao-json-schemas/schemas/agent-target/group.json';
import jsonSchemaHttpApiAt from '../../../../lib/cacao-json-schemas/schemas/agent-target/http-api.json';
import jsonSchemaIndividual from '../../../../lib/cacao-json-schemas/schemas/agent-target/individual.json';
import jsonSchemaLinux from '../../../../lib/cacao-json-schemas/schemas/agent-target/linux.json';
import jsonSchemaLocation from '../../../../lib/cacao-json-schemas/schemas/agent-target/location.json';
import jsonSchemaNetAddress from '../../../../lib/cacao-json-schemas/schemas/agent-target/net-address.json';
import jsonSchemaOrganization from '../../../../lib/cacao-json-schemas/schemas/agent-target/organization.json';
import jsonSchemaSector from '../../../../lib/cacao-json-schemas/schemas/agent-target/sector.json';
import jsonSchemaSecurityCategory from '../../../../lib/cacao-json-schemas/schemas/agent-target/security-category.json';
import jsonSchemaSshAt from '../../../../lib/cacao-json-schemas/schemas/agent-target/ssh.json';

// Command Data JSON schemas imports
import jsonSchemaCommandData from '../../../../lib/cacao-json-schemas/schemas/commands/command-data.json';
import jsonSchemaBash from '../../../../lib/cacao-json-schemas/schemas/commands/bash.json';
import jsonSchemaCalderaCmd from '../../../../lib/cacao-json-schemas/schemas/commands/caldera-cmd.json';
import jsonSchemaElastic from '../../../../lib/cacao-json-schemas/schemas/commands/elastic.json';
import jsonSchemaHttpApiCmd from '../../../../lib/cacao-json-schemas/schemas/commands/http-api.json';
import jsonSchemaJupyter from '../../../../lib/cacao-json-schemas/schemas/commands/jupyter.json';
import jsonSchemaKestrel from '../../../../lib/cacao-json-schemas/schemas/commands/kestrel.json';
import jsonSchemaManual from '../../../../lib/cacao-json-schemas/schemas/commands/manual.json';
import jsonSchemaOpenc2Http from '../../../../lib/cacao-json-schemas/schemas/commands/openc2-http.json';
import jsonSchemaPowershell from '../../../../lib/cacao-json-schemas/schemas/commands/powershell.json';
import jsonSchemaSigma from '../../../../lib/cacao-json-schemas/schemas/commands/sigma.json';
import jsonSchemaSshCmd from '../../../../lib/cacao-json-schemas/schemas/commands/ssh.json';
import jsonSchemaYara from '../../../../lib/cacao-json-schemas/schemas/commands/yara.json';

// Data marking JSON schema imports
import jsonSchemaDataMarking from '../../../../lib/cacao-json-schemas/schemas/data-markings/data-marking.json';
import jsonSchemaMarkingIep from '../../../../lib/cacao-json-schemas/schemas/data-markings/marking-iep.json';
import jsonSchemaMarkingStatement from '../../../../lib/cacao-json-schemas/schemas/data-markings/marking-statement.json';
import jsonSchemaMarkingTlp from '../../../../lib/cacao-json-schemas/schemas/data-markings/marking-tlp.json';

// Data types JSON schema imports
import jsonSchemaCivicLocation from '../../../../lib/cacao-json-schemas/schemas/data-types/civic-location.json';
import jsonSchemaContact from '../../../../lib/cacao-json-schemas/schemas/data-types/contact.json';
import jsonSchemaExternalreference from '../../../../lib/cacao-json-schemas/schemas/data-types/external-reference.json';
import jsonSchemaIdentifier from '../../../../lib/cacao-json-schemas/schemas/data-types/identifier.json';
import jsonSchemaPlaybookProcessingSummary from '../../../../lib/cacao-json-schemas/schemas/data-types/playbook-processing-summary.json';
import jsonSchemaSignature from '../../../../lib/cacao-json-schemas/schemas/data-types/signature.json';
import jsonSchemaTimestamp from '../../../../lib/cacao-json-schemas/schemas/data-types/timestamp.json';
import jsonSchemaVariable from '../../../../lib/cacao-json-schemas/schemas/data-types/variable.json';

// Extension definition JSON schema import
import jsonSchemaExtensionDefinition from '../../../../lib/cacao-json-schemas/schemas/extension-definition/extension-definition.json';

// Playbook JSON schema imports
import jsonSchemaPlaybook from '../../../../lib/cacao-json-schemas/schemas/playbook.json';

// Workflows JSON schema imports
import jsonSchemaAction from '../../../../lib/cacao-json-schemas/schemas/workflows/action.json';
import jsonSchemaEnd from '../../../../lib/cacao-json-schemas/schemas/workflows/end.json';
import jsonSchemaIfCondition from '../../../../lib/cacao-json-schemas/schemas/workflows/if-condition.json';
import jsonSchemaParallel from '../../../../lib/cacao-json-schemas/schemas/workflows/parallel.json';
import jsonSchemaPlaybookAction from '../../../../lib/cacao-json-schemas/schemas/workflows/playbook-action.json';
import jsonSchemaStart from '../../../../lib/cacao-json-schemas/schemas/workflows/start.json';
import jsonSchemaSwitchCondition from '../../../../lib/cacao-json-schemas/schemas/workflows/switch-condition.json';
import jsonSchemaWhileCondition from '../../../../lib/cacao-json-schemas/schemas/workflows/while-condition.json';
import jsonSchemaWorkflowStep from '../../../../lib/cacao-json-schemas/schemas/workflows/workflow-step.json';

// Authentication info JSON schema imports
import jsonSchemaAuthenticationInfo from '../../../../lib/cacao-json-schemas/schemas/authentication-info/authentication-info.json';
import jsonSchemaHttpBasic from '../../../../lib/cacao-json-schemas/schemas/authentication-info/http-basic.json';
import jsonSchemaOauth2 from '../../../../lib/cacao-json-schemas/schemas/authentication-info/oauth2.json';
import jsonSchemaUserAuth from '../../../../lib/cacao-json-schemas/schemas/authentication-info/user-auth.json';

// Execution status JSON schema import
import jsonSchemaStatusElement from '../../../../lib/workflow-status/schema/execution-status.json';

// Coordinate extension defitnition JSON schemas import
import jsonCoordinatesExtensionDefinition from '../../../../lib/cacao-coordinates-extension/extension-definition/extension-definition--418ee24c-9cb1-46d9-afa5-309e01aabc7f.json';

/* Imports of types from CACAO-js library */

// Agent targets
import {
  AgentTarget,
  Group,
  HttpApi,
  Individual,
  Linux,
  Location,
  Manual,
  NetAddress,
  Organization,
  Sector,
  SecurityCategory,
  Ssh,
} from 'cacao2-js';

// Command data
import {
  CommandData,
  Bash,
  CalderaCmd,
  Elastic,
  HttpApi_cmd,
  Jupyter,
  Kestrel,
  Openc2Http,
  Powershell,
  Sigma,
  Ssh_cmd,
  Yara,
} from 'cacao2-js';

// Data markings
import {
  DataMarking,
  MarkingIep,
  MarkingStatement,
  MarkingTlp,
} from 'cacao2-js';

// Data types
import {
  CivicLocation,
  Contact,
  ExternalReference,
  PlaybookProcessingSummary,
  Variable,
  Signature,
} from 'cacao2-js';

// Extension definition
import { ExtensionDefinition } from 'cacao2-js';

// Playbook
import { Playbook } from 'cacao2-js';

// Workflow steps
import {
  ActionStep,
  EndStep,
  IfConditionStep,
  ParallelStep,
  PlaybookActionStep,
  StartStep,
  SwitchConditionStep,
  WhileConditionStep,
  WorkflowStep,
} from 'cacao2-js';

// Authentication-info
import { AuthenticationInfo, HttpBasic, Oauth2, UserAuth } from 'cacao2-js';

/* END of CACAO-js imports  */

// Import of User settings
import UserSettingsProps from '../../../app/UserSettingsProps';

//Contains all the schemas that are used as a reference for extending a schema
export const schemaDictWithoutAgentTarget: any = {
  'command-data': jsonSchemaCommandData,
  bash: jsonSchemaBash,
  'caldera-cmd': jsonSchemaCalderaCmd,
  elastic: jsonSchemaElastic,
  'http-api': jsonSchemaHttpApiCmd,
  jupyter: jsonSchemaJupyter,
  kestrel: jsonSchemaKestrel,
  manual: jsonSchemaManual,
  'openc2-http': jsonSchemaOpenc2Http,
  powershell: jsonSchemaPowershell,
  sigma: jsonSchemaSigma,
  ssh: jsonSchemaSshCmd,
  yara: jsonSchemaYara,
  'data-marking': jsonSchemaDataMarking,
  'marking-iep': jsonSchemaMarkingIep,
  'marking-statement': jsonSchemaMarkingStatement,
  'marking-tlp': jsonSchemaMarkingTlp,
  'civic-location': jsonSchemaCivicLocation,
  contact: jsonSchemaContact,
  'external-reference': jsonSchemaExternalreference,
  identifier: jsonSchemaIdentifier,
  'playbook-processing-summary': jsonSchemaPlaybookProcessingSummary,
  signature: jsonSchemaSignature,
  timestamp: jsonSchemaTimestamp,
  variable: jsonSchemaVariable,
  'extension-definition': jsonSchemaExtensionDefinition,
  playbook: jsonSchemaPlaybook,
  action: jsonSchemaAction,
  end: jsonSchemaEnd,
  'if-condition': jsonSchemaIfCondition,
  parallel: jsonSchemaParallel,
  'playbook-action': jsonSchemaPlaybookAction,
  start: jsonSchemaStart,
  'switch-condition': jsonSchemaSwitchCondition,
  'while-condition': jsonSchemaWhileCondition,
  'workflow-step': jsonSchemaWorkflowStep,
  execution_status: jsonSchemaStatusElement,
  'authentication-info': jsonSchemaAuthenticationInfo,
  'http-basic': jsonSchemaHttpBasic,
  oauth2: jsonSchemaOauth2,
  'user-auth': jsonSchemaUserAuth,
};

// Maps Agent Target class and its subclasses to their respective JSON schemas
export const schemaDictAgentTarget: any = {
  'agent-target': jsonSchemaAgentTarget,
  group: jsonSchemaGroup,
  'http-api': jsonSchemaHttpApiAt,
  individual: jsonSchemaIndividual,
  linux: jsonSchemaLinux,
  location: jsonSchemaLocation,
  'net-address': jsonSchemaNetAddress,
  organization: jsonSchemaOrganization,
  sector: jsonSchemaSector,
  'security-category': jsonSchemaSecurityCategory,
  ssh: jsonSchemaSshAt,
};

// Maps Agent Target class and its subclasses to their respective JSON schemas
export const schemaDictWithoutCommands: any = {
  'agent-target': jsonSchemaAgentTarget,
  group: jsonSchemaGroup,
  'http-api': jsonSchemaHttpApiAt,
  individual: jsonSchemaIndividual,
  linux: jsonSchemaLinux,
  location: jsonSchemaLocation,
  'net-address': jsonSchemaNetAddress,
  organization: jsonSchemaOrganization,
  sector: jsonSchemaSector,
  'security-category': jsonSchemaSecurityCategory,
  ssh: jsonSchemaSshAt,
  'data-marking': jsonSchemaDataMarking,
  'marking-iep': jsonSchemaMarkingIep,
  'marking-statement': jsonSchemaMarkingStatement,
  'marking-tlp': jsonSchemaMarkingTlp,
  'civic-location': jsonSchemaCivicLocation,
  contact: jsonSchemaContact,
  'external-reference': jsonSchemaExternalreference,
  identifier: jsonSchemaIdentifier,
  'playbook-processing-summary': jsonSchemaPlaybookProcessingSummary,
  signature: jsonSchemaSignature,
  timestamp: jsonSchemaTimestamp,
  variable: jsonSchemaVariable,
  'extension-definition': jsonSchemaExtensionDefinition,
  playbook: jsonSchemaPlaybook,
  action: jsonSchemaAction,
  end: jsonSchemaEnd,
  'if-condition': jsonSchemaIfCondition,
  parallel: jsonSchemaParallel,
  'playbook-action': jsonSchemaPlaybookAction,
  start: jsonSchemaStart,
  'switch-condition': jsonSchemaSwitchCondition,
  'while-condition': jsonSchemaWhileCondition,
  'workflow-step': jsonSchemaWorkflowStep,
  execution_status: jsonSchemaStatusElement,
  'authentication-info': jsonSchemaAuthenticationInfo,
  'http-basic': jsonSchemaHttpBasic,
  oauth2: jsonSchemaOauth2,
  'user-auth': jsonSchemaUserAuth,
};

export const classDictWithoutAgentTarget: any = {
  'command-data': CommandData,
  bash: Bash,
  'caldera-cmd': CalderaCmd,
  elastic: Elastic,
  'http-api': HttpApi_cmd,
  jupyter: Jupyter,
  kestrel: Kestrel,
  manual: Manual,
  'openc2-http': Openc2Http,
  powershell: Powershell,
  sigma: Sigma,
  ssh: Ssh_cmd,
  yara: Yara,
  'data-marking': DataMarking,
  'marking-iep': MarkingIep,
  'marking-statement': MarkingStatement,
  'marking-tlp': MarkingTlp,
  'civic-location': CivicLocation,
  contact: Contact,
  'external-reference': ExternalReference,
  identifier: String,
  'playbook-processing-summary': PlaybookProcessingSummary,
  signature: Signature,
  timestamp: String,
  variable: Variable,
  'extension-definition': ExtensionDefinition,
  playbook: Playbook,
  action: ActionStep,
  end: EndStep,
  'if-condition': IfConditionStep,
  parallel: ParallelStep,
  'playbook-action': PlaybookActionStep,
  start: StartStep,
  'switch-condition': SwitchConditionStep,
  'while-condition': WhileConditionStep,
  'workflow-step': WorkflowStep,
  'authentication-info': AuthenticationInfo,
  'http-basic': HttpBasic,
  oauth2: Oauth2,
  'user-auth': UserAuth,
};

// Maps Agent Target class and its subclasses to their respective CACAO library classes
export const classDictAgentTarget: any = {
  'agent-target': AgentTarget,
  group: Group,
  'http-api': HttpApi,
  individual: Individual,
  linux: Linux,
  location: Location,
  'net-address': NetAddress,
  organization: Organization,
  sector: Sector,
  'security-category': SecurityCategory,
  ssh: Ssh,
};

export const keyNameDict: { [key: string]: string } = {
  variable: 'name',
  identifier: 'identifier',
  any: 'identifier',
  agent_definitions: 'identifier',
  target_definitions: 'identifier',
  'extension-definition': 'identifier',
  'marking-tlp': 'identifier',
  agent_target_extensions: 'identifier',
  address: 'address',
  marking_extensions: 'identifier',
  email: 'type of email',
  phone: 'type of number',
};

export const identifierReferences: { [key: string]: string } = {
  agent: 'agent_definitions',
  targets: 'target_definitions',
  'agents-display': 'agent_definitions',
  'targets-display': 'target_definitions',
  on_failure: 'workflow',
  on_success: 'workflow',
  on_completion: 'workflow',
  on_true: 'workflow',
  on_false: 'workflow',
  workflow_exception: 'workflow',
  markings: 'data_marking_definitions',
  next_steps: 'workflow',
  playbook_extensions: 'extension_definitions',
  step_extensions: 'extension_definitions',
  agent_target_extensions: 'extension_definitions',
  marking_extensions: 'extension_definitions',
  authentication_info_definitions: 'authentication-info',
  commands: 'command-data',
};

export const propertiesToUpdate: { [key: string]: () => any } = {
  modified: () => {
    return new Date().toISOString();
  },
};

export const neededDefinitionProperties: { [key: string]: string[] } = {
  'extension-definition': ['created_by'],
  'marking-statement': ['created_by', 'created', 'modified'],
  'authentication-info': [],
  'agent-target': [],
};

export const propertiesFunction: { [key: string]: () => any } = {
  modified: () => {
    return new Date().toISOString();
  },
  created: () => {
    return new Date().toISOString();
  },
  created_by: () => {
    return UserSettingsProps.instance.identifier;
  },
};

export const uneditablePropertiesTimestamp: string[] = ['created', 'modified'];

export const uneditableProperties: string[] = [
  'id',
  'on_completion',
  'on_success',
  'on_failure',
  'workflow_start',
  'on_true',
  'on_false',
  'created_by',
];

export const removedProperties: string[] = [
  'on_completion',
  'on_success',
  'on_failure',
  'workflow',
  'on_true',
  'on_false',
  'next_steps',
  'workflow_start',
  'spec_version',
];

export const defaultType: { [key: string]: string } = {
  agent_definitions: 'agent-target',
  target_definitions: 'agent-target',
  extension_definitions: 'extension-definition',
  data_marking_definitions: 'marking-statement',
  authentication_info_definitions: 'authentication-info',
};

export const valueToDisplay: { [key: string]: Array<string> } = {
  'external-reference': ['name', 'description', 'id'],
  'extension-definition': ['name', 'description', 'id'],
  signature: ['created', 'id'],
  'command-data': ['playbook_activity', 'type', 'command', 'description'],
  'agent-target': ['name', 'type', 'description', 'id'],
  'marking-statement': ['statement', 'name', 'type', 'description', 'id'],
  'marking-tlp': ['tlpv2_level'],
  'marking-iep': ['name', 'type', 'description', 'id'],
};

export const commonTypeDict: { [key: string]: string } = {
  group: 'agent-target',
  'http-api': 'agent-target',
  individual: 'agent-target',
  linux: 'agent-target',
  location: 'agent-target',
  'net-address': 'agent-target',
  organization: 'agent-target',
  sector: 'agent-target',
  'security-category': 'agent-target',
  ssh: 'agent-target',
  'http-basic': 'authentication-info',
  oauth2: 'authentication-info',
  'private-key': 'authentication-info',
  'user-auth': 'authentication-info',
};

export const addressTypes: string[] = ['ipv4', 'ipv6', 'l2mac', 'url', 'vlan'];

export const tlpv2_levels: string[] = [
  'TLP:RED',
  'TLP:AMBER',
  'TLP:AMBER+STRICT',
  'TLP:GREEN',
  'TLP:CLEAR',
];

interface Schema {
  type?: string;
  properties?: Record<string, object>;
  $ref?: string;
  items?: any;
  patternProperties?: Record<string, Schema>;
  enum?: any;
  allOf?: Schema[];
  required?: string[];
  $defs?: Record<string, Schema>;
  anyOf?: any;
  oneOf?: any;
  description?: string;
}

export const propertyObject: any = {
  'command-data': 'command',
  'external-reference': 'name',
  signature: 'id',
};

export const stepWithStatus: string[] = [
  'action',
  'playbook-action',
  'parallel',
  'if-condition',
  'while-condition',
  'switch-condition',
];

export const executionStatusColor: any = {
  successfully_completed: 'rgb(187 252 209)',
  failed: 'rgb(255 175 175)',
  ongoing: 'rgb(160 209 255)',
  server_side_error: 'rgb(255 175 175)',
  client_side_error: 'rgb(255 175 175)',
  timeout_error: 'rgb(255 175 175)',
  exception_condition_invoked: 'rgb(255 175 175)',
};

export const executionStatusColorStrong: any = {
  successfully_completed: '#008127',
  failed: 'rgb(180 40 41)',
  ongoing: 'rgb(9 84 109)',
  server_side_error: 'rgb(180 40 41)',
  client_side_error: 'rgb(180 40 41)',
  timeout_error: 'rgb(180 40 41)',
  exception_condition_invoked: 'rgb(180 40 41)',
};

export const executionStatusColorLight: any = {
  successfully_completed: 'rgb(225 255 235)',
  failed: 'rgb(255 229 229)',
  ongoing: 'rgb(221 235 248)',
  server_side_error: 'rgb(255 229 229)',
  client_side_error: 'rgb(255 229 229)',
  timeout_error: 'rgb(255 229 229)',
  exception_condition_invoked: 'rgb(255 229 229)',
};

export const orderInputList = [
  'revoked',
  'title',
  'id',
  'type',
  'tlpv2_level',
  'name',
  'description',
  'commands',
  'agent',
  'targets',
  'step_variables',
  'in_args',
  'out_args',
];

export const CoordinatesExtensionIdentifier =
  'extension-definition--418ee24c-9cb1-46d9-afa5-309e01aabc7f';
export const CoordinatesExtensionDefinition =
  jsonCoordinatesExtensionDefinition;

export function updateProperty(propertyObject: any) {
  if (propertyObject == undefined) {
    return propertyObject;
  }
  for (const key in propertiesToUpdate) {
    if (propertyObject[key]) {
      propertyObject[key] = propertiesToUpdate[key]();
    }
  }
  return propertyObject;
}

/**
 * Gets the type of a property in the schema, which can be
 * string, number, boolean, integer, array, object, enum, any or any other type
 *
 * @param schema schema or subschema
 * @returns type of the property, which can be an object
 */
function getType(
  schema: Schema,
  schemaDict: Record<string, Schema>,
): string | object {
  //get only the referenced type, without the path and '.json'
  if (schema.$ref) {
    const refType = schema.$ref.split('/').pop()?.split('.')[0];
    return refType || '';
  }

  //handles the switch-condition:cases
  if (schema.oneOf) {
    return 'identifier';
  }

  switch (schema.type) {
    case 'string':
      if (schema.enum && schema.enum.length == 1) {
        return schema.enum[0];
      }
    case 'number':
    case 'boolean':
    case 'integer':
      return schema.type; // For basic types
    case 'array':
      if (schema.items) {
        return getType(schema.items, schemaDict) + '[]';
      }
      break;
    case 'object':
      //In case the type is object, return an object with all the properties in properties or patternProperties
      if (schema.properties || schema.patternProperties) {
        const objectProperties: Record<string, any> = {};
        if (schema.properties) {
          Object.entries(schema.properties).forEach(
            ([propertyName, propertySchema]) => {
              objectProperties[propertyName] = getType(
                propertySchema,
                schemaDict,
              );
            },
          );
        }
        if (schema.patternProperties) {
          Object.entries(schema.patternProperties).forEach(
            ([pattern, propertySchema]) => {
              objectProperties[pattern] = getType(propertySchema, schemaDict);
            },
          );
        }
        return objectProperties;
      }
      break;
  }
  if (schema.type) {
    return schema.type;
  }
  if (schema.enum) {
    return 'enum';
  }

  return 'any';
}

/**
 * Gets the description of the property.
 */
function getDescription(schema: Schema, schemaDict: Record<string, Schema>) {
  if (schema.description) {
    return schema.description;
  }
  return undefined;
}

/**
 * Gets the enums required for the side panel fields
 *
 * @param schema
 * @param schemaDict
 * @returns
 */
function extractEnums(
  schema: Schema,
  schemaDict: Record<string, Schema>,
): Record<string, any> {
  const enums: Record<string, any> = {};

  if (schema.$defs) {
    Object.entries(schema.$defs).forEach(([defName, defSchema]) => {
      if (defSchema.enum && Array.isArray(defSchema.enum)) {
        enums[defName] = defSchema.enum;
      } else if (defSchema.anyOf && Array.isArray(defSchema.anyOf)) {
        const enumValues = defSchema.anyOf
          .filter(subSchema => subSchema.enum && Array.isArray(subSchema.enum))
          .flatMap(subSchema => subSchema.enum);
        if (enumValues.length > 0) {
          enums[defName] = enumValues;
        }
      } else if (defSchema.$ref) {
        const refSchema = schemaDict[defSchema.$ref];
        if (refSchema) {
          const extractedEnums = extractEnums(refSchema, schemaDict);
          Object.assign(enums, extractedEnums);
        }
      }
    });
  }

  return enums;
}

/**
 * Extract the types from the properties of a json schema
 *
 * @param schema
 * @returns a Record containing 4 string properties :
 * properties : a dictionary with keys being the name of the properties, the value their types
 * commonProperties : similar to properties, but for the values of the referenced schemas
 * required : list values required, per the json schema
 * enums : dictionary of enums, the key being the name of the enum
 */
export function extractSchemaTypes(
  schema: Schema,
  schemaDict: Record<string, any>,
): Record<string, any> {
  const dictionary: Record<string, any> = {};
  dictionary.properties = {};
  dictionary.enums = {};
  dictionary.descriptions = {};

  if (schema.required) {
    dictionary.required = schema.required;
  }
  if (schema.properties) {
    Object.entries(schema.properties).forEach(
      ([propertyName, propertySchema]) => {
        dictionary.properties[propertyName] = getType(
          propertySchema,
          schemaDict,
        );
      },
    );
    Object.entries(schema.properties).forEach(
      ([propertyName, propertySchema]) => {
        dictionary.descriptions[propertyName] = getDescription(
          propertySchema,
          schemaDict,
        );
      },
    );
  }

  //Handles the parent construct, to get the common properties
  if (schema.allOf) {
    dictionary.commonProperties = {};

    schema.allOf.forEach(subSchema => {
      if (subSchema.$ref) {
        const refSchema =
          schemaDict[subSchema.$ref.split('/').pop()?.split('.')[0] as string];
        if (refSchema) {
          const refDictionary = extractSchemaTypes(refSchema, schemaDict);
          dictionary.commonProperties = refDictionary.properties;
          if (refDictionary.required) {
            dictionary.required = [
              ...(dictionary.required || []),
              ...refDictionary.required,
            ];
          }
          if (refDictionary.enums) {
            dictionary.enums = { ...dictionary.enums, ...refDictionary.enums };
          }
          if (refDictionary.descriptions) {
            dictionary.descriptions = {
              ...dictionary.descriptions,
              ...refDictionary.descriptions,
            };
          }
        }
      } else if (subSchema.properties) {
        Object.entries(subSchema.properties).forEach(
          ([propertyName, propertySchema]) => {
            dictionary.properties[propertyName] = getType(
              propertySchema,
              schemaDict,
            );
          },
        );
        Object.entries(subSchema.properties).forEach(
          ([propertyName, propertySchema]) => {
            dictionary.descriptions[propertyName] = getDescription(
              propertySchema,
              schemaDict,
            );
          },
        );
      }
    });
  }

  const extractedEnums = extractEnums(schema, schemaDict);
  if (Object.keys(extractedEnums).length > 0) {
    dictionary.enums = { ...dictionary.enums, ...extractedEnums };
  }

  if (!dictionary.properties) dictionary.properties = {};
  if (!dictionary.commonProperties) dictionary.commonProperties = {};
  if (!dictionary.required) dictionary.required = [];
  if (!dictionary.enums) dictionary.enums = {};
  return dictionary;
}
