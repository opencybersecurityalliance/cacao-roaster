import { Playbook } from '../../../../lib/cacao2-js/src/Playbook';
import type { Identifier } from '../../../../lib/cacao2-js/src/data-types/Identifier';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowStepFactory } from '../../../../lib/cacao2-js/src/workflows/WorkflowStepFactory';
import { CacaoConnectionType } from '../../elements/connections/CacaoBaseConnection';
import type { WorkflowStep } from '../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import type { WhileConditionStep } from '../../../../lib/cacao2-js/src/workflows/WhileConditionStep';
import type { SwitchConditionStep } from '../../../../lib/cacao2-js/src/workflows/SwitchConditionStep';
import type { IfConditionStep } from '../../../../lib/cacao2-js/src/workflows/IfConditionStep';
import type { ParallelStep } from '../../../../lib/cacao2-js/src/workflows/ParallelStep';
import type ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import type EventBus from 'diagram-js/lib/core/EventBus';
import { ExecutionStatus, StatusElement } from '../../modules/model/status/status-model/ExecutionStatus';
import type { Connection, Shape } from 'diagram-js/lib/model';
import CacaoUtils from '../core/CacaoUtils';
import { CoordinatesExtension } from './coordinates-extension/CoordinatesExtension';
import { ConnectionExtension } from './coordinates-extension/ConnectionExtension';
import { CasesConnectionExtension } from './coordinates-extension/CasesConnectionExtension';
import { NextStepsConnectionExtension } from './coordinates-extension/NextStepsConnectionExtension';
import { CoordinatesExtensionIdentifier } from './SchemaTypes';
import UserSettingsProps from '../../../app/UserSettingsProps';
import isEqual from 'lodash.isequal';
import IntegrationLog from '../features/integration-logs/IntegrationLog';

/**
 * Spefify the playbook changing
 */
export type ContextPlaybookAttrs = {
	action:
	| 'remove.shape'
	| 'remove.connection'
	| 'add.shape'
	| 'add.connection'
	| 'update.metadata'
	| 'update.connection'
	| 'update.shape';
	element: Shape | Connection;
};

/**
 * a class which represents a controller/interface to communicate with the cacao model
 */
export default class PlaybookHandler {
	private _playbook: Playbook;
	private _initialPlaybook: Playbook;
	private _eventBus: EventBus;
	private _elementRegistry: ElementRegistry;
	private _executionStatus: ExecutionStatus;
	private _integrationLog: IntegrationLog;
	static $inject: string[];

	// Simple coordinates cache
	private static _coordinatesCache: Record<string, CoordinatesExtension> = {};

	constructor(eventBus: EventBus, playbook: Playbook, executionStatus: ExecutionStatus, elementRegistry: ElementRegistry) {
		this._eventBus = eventBus;
		this._playbook = playbook;
		this._initialPlaybook = new Playbook(playbook);
		this._executionStatus = new ExecutionStatus();
		this._elementRegistry = elementRegistry;
		if (executionStatus) {
			this.setExecutionStatus(executionStatus);
		}
		this._integrationLog = new IntegrationLog(eventBus);

		eventBus.on('diagram.clear', 1, () => {
			this._playbook = this.newPlaybook();
			this.clearCoordinatesCache(); // Clear cache when diagram is cleared
			this._eventBus.fire('playbook.changed', undefined);
		});
		eventBus.on('editor.loaded', () => {
			eventBus.fire('load.workflow', { playbook: this._playbook });
			this._eventBus.fire('playbook.changed', undefined);
			this._initialPlaybook = new Playbook(playbook);
		});
	}

	/**
	 * Returns true if the current user of the app is the creator of the playbook
	 */
	get isUserTheOwner(): boolean {
		return this.playbook.created_by === UserSettingsProps.instance.identifier;
	}

	getShapeStatus(stepId: string) {
		if (this.hasExecutionStatus() && stepId) {
			const stepStatuses = this.getStepStatus(stepId);
			if (stepStatuses.length > 0) {
				return this.getLatestStepStatus(stepStatuses).status;
			}
		}
		return undefined;
	}

	get isPlaybookChanged(): boolean {
		const compareInitialPlaybook = new Playbook(this._initialPlaybook);
		const comparePlaybook = new Playbook(this._playbook);

		compareInitialPlaybook.signatures = [];
		compareInitialPlaybook.created = '';
		compareInitialPlaybook.modified = '';
		comparePlaybook.signatures = [];
		comparePlaybook.created = '';
		comparePlaybook.modified = '';

		// console.log(CacaoUtils.filterEmptyValues(compareInitialPlaybook));
		// console.log(CacaoUtils.filterEmptyValues(comparePlaybook));
		const returnValue = !isEqual(
			CacaoUtils.filterEmptyValues(compareInitialPlaybook),
			CacaoUtils.filterEmptyValues(comparePlaybook),
		);
		return returnValue;
	}

	get playbook(): Playbook {
		return this._playbook;
	}

	set initialPlaybook(playbook: Playbook) {
		this._initialPlaybook = new Playbook(playbook);
	}

	isAgentDefinition(agent: string): boolean {
		if (this._playbook.agent_definitions) {
			const listOfAgent = Object.keys(this._playbook.agent_definitions);
			if (listOfAgent.includes(agent)) {
				return true;
			}
		}
		return false;
	}

	setPlaybookDates() {
		const currentDate = new Date().toISOString();
		if (!this.playbook.created) {
			this.addPlaybookProperty('created', currentDate);
			this.addPlaybookProperty('modified', currentDate);
		}
		if (this.isPlaybookChanged) {
			this.addPlaybookProperty('modified', currentDate);
		}
	}

	/**
	 * Gets the value of a step's property.
	 * @param property the step's property
	 * @param idStep the step's id
	 * @returns string    the value
	 */
	getStepProperty(property: string, idStep: string): string {
		if (idStep === 'metadata') {
			if ((this._playbook as any)[property]) {
				return (this._playbook as any)[property];
			}
			return '';
		}
		if ((this._playbook.workflow[idStep] as any)[property]) {
			return (this._playbook.workflow[idStep] as any)[property];
		}
		return '';
	}

	getPlaybookProperties(property: string) {
		if ((this._playbook as any)[property]) {
			return (this._playbook as any)[property];
		}
		return '';
	}

	/**
	 *
	 * @param obj
	 * @param idStep the step id
	 */
	setPlaybookProperties(obj: any, stepId?: string) {
		if (obj) {
			if (stepId) {
				(this.playbook.workflow[stepId] as any).update(obj);
			} else {
				this._playbook.update(obj);
			}
			const context: ContextPlaybookAttrs = {
				action: 'update.metadata',
				element: this._playbook as any,
			};
			this._eventBus.fire('playbook.changed', context);
		}
	}

	addPlaybookProperty(propertyName: string, value: any) {
		(this.playbook as any)[propertyName] = value;
	}

	/**
	 * Changes the type of the connection by disconnecting the steps and reconnecting them.
	 * @param idFrom
	 * @param idTo
	 * @param oldType
	 * @param newType
	 */
	updateConnection(
		idFrom: string,
		idTo: string,
		oldType: CacaoConnectionType,
		newType: CacaoConnectionType,
	) {
		this.disconnectSteps(idFrom, idTo, oldType);
		this.connectSteps(idFrom, idTo, newType);
	}

	/**
	 * Create a step of the desired type with the id provided. If a step of the given id already exists, nothing is done.
	 * @param modelType
	 * @param id
	 * @returns boolean True if a new step is created in the playbook, False otherwise
	 */
	createStep(modelType: string, id: Identifier): boolean {
		if (this._playbook.workflow[id]) return false;

		const step = WorkflowStepFactory.create({ type: modelType } as any);

		if (modelType === 'start' && CacaoUtils.isUndefined(this._playbook.workflow_start)) {
			this._playbook.workflow_start = id;
		}
		this._playbook.workflow[id] = step;
		return true;
	}

	/**
	 * Remove a step from the playbook.
	 * @param stepId
	 */
	removeStep(stepId: string) {
		if (!this._playbook.workflow[stepId]) {
			throw new Error('the step you wants to delete does not exist');
		}
		delete this._playbook.workflow[stepId];

		if (this._playbook.workflow_start === stepId) {
			this._playbook.workflow_start = '';
		}

		if (this._playbook.workflow_exception === stepId) {
			this._playbook.workflow_exception = '';
		}
	}

	loadPlaybook(playbook: Playbook) {
		this._playbook = new Playbook(playbook);
		const context: ContextPlaybookAttrs = {
			action: 'update.metadata',
			element: this._playbook as any,
		};
		this._eventBus.fire('playbook.changed', context);
	}

	/**
	 * Returns all the identifier of a property.
	 * @param propertyName name of the property to fetch the identifiers from
	 */
	getAllPropertyIdentifier(propertyName: string): Identifier[] {
		if ((this._playbook as any)[propertyName]) {
			return Object.keys((this._playbook as any)[propertyName]);
		}
		return [];
	}

	getAllPropertyDict(propertyName: string): { [key: Identifier]: any } {
		return (this._playbook as any)[propertyName];
	}

	/**
	 * Returns a completely new empty playbook.
	 * @returns
	 */
	newPlaybook(): Playbook {
		const startId = `start--${uuidv4()}`;

		const workflow: { [k: string]: WorkflowStep } = {};
		workflow[startId] = { type: 'start' } as WorkflowStep;

		return new Playbook({
			id: `playbook--${uuidv4()}`,
			name: 'Playbook Name',
			created_by: `identity--${uuidv4()}`,
			workflow_start: startId,
			workflow: workflow,
		});
	}

	/**
	 * Connects two shapes. If they are already connected, nothing is done.
	 * @param idFrom
	 * @param idTo
	 * @param type
	 * @returns boolean True if a it connect something, False otherwise
	 */
	connectSteps(idFrom: string, idTo: string, type: CacaoConnectionType): void {
		let fromStep: WorkflowStep | any;
		// eslint-disable-next-line prefer-const
		fromStep = this.getStep(idFrom);

		if (!fromStep) {
			throw new Error(`step not found with id: ${idFrom}`);
		}

		switch (type) {
			case CacaoConnectionType.ON_COMPLETION: {
				if (CacaoUtils.isDefined(fromStep.on_completion)) {
					//throw new Error("on completion connection already defined");
				}
				fromStep.on_completion = idTo;
				break;
			}
			case CacaoConnectionType.ON_SUCCESS: {
				if (CacaoUtils.isDefined(fromStep.on_success)) {
					//throw new Error("on success connection already defined");
				}
				fromStep.on_success = idTo;
				break;
			}
			case CacaoConnectionType.ON_FAILURE: {
				if (CacaoUtils.isDefined(fromStep.on_failure)) {
					//throw new Error("on failure connection already defined");
				}
				fromStep.on_failure = idTo;
				break;
			}
			case CacaoConnectionType.ON_PARALLEL:
				fromStep.next_steps.push(idTo);
				break;
			case CacaoConnectionType.ON_SWITCH_CONDITION: {
				const switchStep = fromStep as SwitchConditionStep;
				let caseKey = 0;
				//to find an index available for the switch cases
				while (switchStep.cases[caseKey]) {
					caseKey++;
				}
				switchStep.cases[caseKey] = idTo;
				break;
			}
			case CacaoConnectionType.ON_WHILE_CONDITION: {
				const whileStep = fromStep as WhileConditionStep;
				if (CacaoUtils.isDefined(whileStep.on_true)) {
					//throw new Error("while condition connection: on_true already defined");
				}
				whileStep.on_true = idTo;
				break;
			}
			case CacaoConnectionType.ON_IF_TRUE_CONDITION: {
				const ifTStep = fromStep as IfConditionStep;
				if (CacaoUtils.isUndefined(ifTStep.on_true)) {
					ifTStep.on_true = idTo;
				}
				break;
			}
			case CacaoConnectionType.ON_IF_FALSE_CONDITION: {
				const ifFStep = fromStep as IfConditionStep;
				if (CacaoUtils.isUndefined(ifFStep.on_false)) {
					ifFStep.on_false = idTo;
				}
				break;
			}
		}
	}

	disconnectSteps(idFrom: string, idTo: string, type: CacaoConnectionType) {
		const fromStep = this.getStep(idFrom);
		if (!fromStep) return;

		switch (type) {
			case CacaoConnectionType.ON_COMPLETION:
				fromStep.on_completion = '';
				break;
			case CacaoConnectionType.ON_SUCCESS:
				fromStep.on_success = '';
				break;
			case CacaoConnectionType.ON_FAILURE:
				fromStep.on_failure = '';
				break;
			case CacaoConnectionType.ON_PARALLEL: {
				const parallelStep = fromStep as ParallelStep;
				const index = parallelStep.next_steps.indexOf(idTo);
				if (index !== -1) {
					delete parallelStep.next_steps[index];
				} else {
					throw new Error('parallel connection: connection not defined in the list');
				}
				break;
			}
			case CacaoConnectionType.ON_SWITCH_CONDITION: {
				const switchStep = fromStep as SwitchConditionStep;
				let deleted = false;
				for (const key in switchStep.cases) {
					if (switchStep.cases[key] === idTo) {
						delete switchStep.cases[key];
						deleted = true;
						break;
					}
				}
				if (!deleted) {
					throw new Error('parallel connection: connection not defined in the list');
				}
				break;
			}
			case CacaoConnectionType.ON_WHILE_CONDITION: {
				const whileStep = fromStep as WhileConditionStep;
				if (whileStep.on_true === idTo) {
					whileStep.on_true = '';
				} else {
					throw new Error(
						'while condition connection: on_true connected to another idTo',
					);
				}
				break;
			}
			case CacaoConnectionType.ON_IF_TRUE_CONDITION: {
				const ifTStep = fromStep as IfConditionStep;
				if (ifTStep.on_true === idTo) {
					ifTStep.on_true = '';
				} else {
					throw new Error('if condition connection: on_true not connected to idTo');
				}
				break;
			}
			case CacaoConnectionType.ON_IF_FALSE_CONDITION: {
				const ifFStep = fromStep as IfConditionStep;
				if (ifFStep.on_false === idTo) {
					ifFStep.on_false = '';
				} else {
					throw new Error('if condition connection: on_false not connected to idTo');
				}
				break;
			}
		}

		return true;
	}

	getStep(id: string): WorkflowStep {
		return this._playbook.workflow[id] as WorkflowStep;
	}

	addStepComplexProperties(stepId: string, property: string, values: object) {
		if (Array.isArray((this._playbook.workflow[stepId] as any)[property])) {
			(this._playbook.workflow[stepId] as any)[property]?.push(values as object);
		} else {
			const dict = (this._playbook.workflow[stepId] as any)[property];
			(this._playbook.workflow[stepId] as any)[property] = Object.assign({}, dict, values);
		}
		const context: ContextPlaybookAttrs = {
			action: 'update.metadata',
			element: this._playbook as any,
		};
		this._eventBus.fire('playbook.changed', context);
	}

	getListExternalRef(stepId: string): { [key: string]: any }[] {
		if (stepId === 'metadata') {
			return [{}];
		}
		const result: { [key: string]: any }[] = this._playbook.workflow[stepId]
			.external_references as {
				[key: string]: any;
			}[];
		if (result) {
			return result;
		}
		return [{}];
	}

	getList(property: string, stepId: string): string[] {
		if (stepId === 'metadata') {
			return [];
		}
		if ((this._playbook.workflow[stepId] as any)[property]) {
			const list: string[] = (this._playbook.workflow[stepId] as any)[property];
			if (Array.isArray(list)) {
				return list;
			}
		}
		return [];
	}

	getDic(stepId: string, property: string) {
		if (stepId === 'metadata') {
			return {};
		}
		return (this._playbook.workflow[stepId] as any)[property];
	}

	getPreviousSteps(stepId: Identifier, playbook: Playbook = this._playbook): Identifier[] {
		const list: Identifier[] = [];

		for (const parentStepId in playbook.workflow) {
			const parentStep = playbook.workflow[parentStepId];

			if (
				stepId === parentStep?.on_completion ||
				stepId === parentStep?.on_success ||
				stepId === parentStep?.on_failure ||
				stepId === (parentStep as IfConditionStep)?.on_true ||
				stepId === (parentStep as IfConditionStep)?.on_false ||
				stepId === (parentStep as WhileConditionStep)?.on_true
			) {
				list.push(parentStepId);
			}
			for (const iterId in (parentStep as SwitchConditionStep).cases) {
				if (iterId === stepId) {
					list.push(parentStepId);
					break;
				}
			}

			for (const iterId in (parentStep as ParallelStep).next_steps) {
				if (iterId === stepId) {
					list.push(parentStepId);
					break;
				}
			}
		}
		return list;
	}

	getAgent(agentId: string) {
		return this.playbook.agent_definitions[agentId];
	}

	getTarget(agentId: string) {
		return this.playbook.target_definitions[agentId];
	}

	removeAgent(agentId: string) {
		delete this.playbook.agent_definitions[agentId];
	}

	removeTarget(targetId: string) {
		delete this.playbook.target_definitions[targetId];
	}

	setAgent(agentId: string, value: any) {
		delete this.playbook.agent_definitions[agentId];
		this.playbook.agent_definitions[value[0]] = value[1];
	}

	setTarget(targetId: string, value: any) {
		delete this.playbook.target_definitions[targetId];
		this.playbook.target_definitions[value[0]] = value[1];
	}

	getNextSteps(step: Partial<WorkflowStep>): [Identifier, CacaoConnectionType][] {
		const list: [Identifier, CacaoConnectionType][] = [];

		if (step?.on_completion) {
			list.push([step?.on_completion, CacaoConnectionType.ON_COMPLETION]);
		}

		if (step?.on_success) {
			list.push([step?.on_success, CacaoConnectionType.ON_SUCCESS]);
		}

		if (step?.on_failure) {
			list.push([step?.on_failure, CacaoConnectionType.ON_FAILURE]);
		}

		switch (step.type) {
			case 'if-condition': {
				const ifStep = step as Partial<IfConditionStep>;
				if (ifStep?.on_true) {
					list.push([ifStep.on_true, CacaoConnectionType.ON_IF_TRUE_CONDITION]);
				}
				if (ifStep?.on_false) {
					list.push([ifStep.on_false, CacaoConnectionType.ON_IF_FALSE_CONDITION]);
				}
				break;
			}
			case 'while-condition': {
				const whileStep = step as Partial<WhileConditionStep>;
				if (whileStep?.on_true) {
					list.push([whileStep.on_true, CacaoConnectionType.ON_WHILE_CONDITION]);
				}
				break;
			}
			case 'switch-condition': {
				const switchStep = step as Partial<SwitchConditionStep>;
				if (switchStep?.cases) {
					for (const key in switchStep.cases) {
						list.push([switchStep.cases[key], CacaoConnectionType.ON_SWITCH_CONDITION]);
					}
				}
				break;
			}
			case 'parallel': {
				const parallelStep = step as Partial<ParallelStep>;
				if (parallelStep?.next_steps) {
					for (const key in parallelStep.next_steps) {
						list.push([parallelStep.next_steps[key], CacaoConnectionType.ON_PARALLEL]);
					}
				}
				break;
			}
		}
		return list;
	}

	/**
	 * The property "data_marking_definitions" holds all the data marking definitions of the playbook
	 * The property "markings" holds all the identifier of the data marking that are used in the playbook
	 *
	 * This methods iterates through the "markings" property and checks all the identifiers in the "data_marking_definitions" property and checks if it's a marking-tlp.
	 * @returns A TLP marking or an empty string
	 */
	getTLPMarking(): '' | 'TLP:GREEN' | 'TLP:AMBER' | 'TLP:RED' | 'TLP:AMBER+STRICT' | 'TLP:WHITE' {
		if (!this._playbook) {
			return '';
		}

		for (const index in this._playbook.markings) {
			const markingId = this._playbook.markings[index];
			const dataMarkingDefinition = this._playbook.data_marking_definitions[markingId];
			if (dataMarkingDefinition && dataMarkingDefinition.type === 'marking-tlp') {
				return (dataMarkingDefinition as any).tlpv2_level;
			}
		}
		return '';
	}

	getPlaybookAndStatus(): object {
		const obj: any = {};
		obj.playbook = this._playbook;
		obj.execution_status = this.getExecutionStatus();
		return obj;
	}

	hasExecutionStatus(): boolean {
		// check if the execution status is empty
		return this.getExecutionStatus().execution_id !== '';
	}

	getExecutionStatus(): ExecutionStatus {
		return this._executionStatus;
	}

	setExecutionStatus(executionStatus: ExecutionStatus) {
		this._executionStatus = new ExecutionStatus(executionStatus);
		// Trigger shape updates for all steps with results
		for (const stepId in this._executionStatus.step_results) {
			this.updateShape(stepId);
		}
	}

	// Checks if the execution status object already exists in the executionStatusArray
	isTheSameExecutionStatus(executionID: string): boolean {
		return this._executionStatus.execution_id === executionID;
	}

	updateExistingExecutionStatus(executionStatus: ExecutionStatus) {
		// properties to update: ended, status, status_text
		this._executionStatus.ended = executionStatus.ended;
		this._executionStatus.status = executionStatus.status;
		this._executionStatus.status_text = executionStatus.status_text;
		// update the step_results object by pushing new status element objects to the stepid arrays.
		for (const stepId in executionStatus.step_results) {
			const statusElements = executionStatus.step_results[stepId];
			this._executionStatus.step_results[stepId] = [];
			for (const statusElement of statusElements) {
				this._executionStatus.step_results[stepId].push(new StatusElement(statusElement));
			}
			// Trigger shape update for this step
			this.updateShape(stepId);
		}
	}

	addStepStatusToExecutionStatus(stepId: string, statusElement: StatusElement) {
		if (!this._executionStatus.step_results[stepId]) {
			this._executionStatus.step_results[stepId] = [];
		}
		this._executionStatus.step_results[stepId].push(new StatusElement(statusElement));
	}

	// Look for status of particular step in every execution status object
	getStepStatus(stepId: string): Array<StatusElement> {
		const stepStatusElements: Array<StatusElement> = [];
		if (this._executionStatus.step_results?.[stepId]) {
			for (const statusElement of this._executionStatus.step_results[stepId]) {
				stepStatusElements.push(new StatusElement(statusElement));
			}
		}
		return stepStatusElements;
	}

	getLatestStepStatus(stepStatuses: Array<StatusElement>): StatusElement {
		let latestStatusElement = stepStatuses[0];
		for (const statusElement of stepStatuses) {
			if (new Date(statusElement.started) > new Date(latestStatusElement.started)) {
				latestStatusElement = statusElement;
			}
		}
		return latestStatusElement;
	}

	/**
	 * Updates the shape of the step with the given stepId.
	 * @param stepId - The ID of the step to update.
	 */
	public updateShape(stepId: string) {
		const element = this._elementRegistry.get(stepId);
		if (element) {
			this._eventBus.fire('shape.update', { element });
		}
	}

	/**
	 * This method updates the position of the provided workflow step or its outgoing connections.
	 * If element = Connection, it will update the outgoing connections of the step coordinates extension.
	 * If element = Shape, it will update the position and size of the step coordiantes extension.
	 * @param element - The element to update.
	 */
	updateCoordinatesExtension(element: Shape | Connection) {
		if (element.waypoints) {
			//is Connection
			const workflowstep = this.playbook.workflow[element?.source?.id];
			if (workflowstep === undefined) {
				throw Error('the connection\'s source does not correspond to any workflow step');
			}
			let coordinatesExtension = this.getCoordinatesExtension(element?.source?.id);
			if (!workflowstep.step_extensions) {
				return;
			}
			if (!coordinatesExtension) {
				workflowstep.step_extensions[CoordinatesExtensionIdentifier] =
					new CoordinatesExtension();
				coordinatesExtension = workflowstep.step_extensions[CoordinatesExtensionIdentifier];
			}
			if (!coordinatesExtension) {
				return;
			}

			const fillCoordinates = (
				connectionExtension: ConnectionExtension,
				connection: Connection,
			) => {
				connectionExtension.x = [];
				connectionExtension.y = [];
				const waypoints = connection?.waypoints;
				if (!waypoints) return;
				for (const point of waypoints) {
					connectionExtension.x.push(point.x);
					connectionExtension.y.push(point.y);
				}
			};

			let connectionExtension: ConnectionExtension | undefined;
			for (const ext of coordinatesExtension.outgoing_connections) {
				if (ext.type === element?.type) {
					switch (ext.type) {
						case 'cases': {
							const casesExt = ext as CasesConnectionExtension;
							if (
								(workflowstep as SwitchConditionStep)?.cases[casesExt.case] ===
								element?.target?.id
							)
								connectionExtension = ext;
							break;
						}
						case 'next_steps': {
							const parallelExt = ext as NextStepsConnectionExtension;
							if (parallelExt.next_step === element?.target?.id)
								connectionExtension = ext;
							break;
						}
						default:
							connectionExtension = ext;
							break;
					}
				}
			}
			if (connectionExtension === undefined) {
				if (element?.type === 'cases') {
					const newExtension = new CasesConnectionExtension();
					for (const key of Object.keys((workflowstep as SwitchConditionStep)?.cases)) {
						if (
							(workflowstep as SwitchConditionStep)?.cases[key] ===
							element?.target?.id
						) {
							newExtension.case = key;
							break;
						}
					}
					connectionExtension = newExtension;
				} else if (element?.type === 'next_steps') {
					const newExtension = new NextStepsConnectionExtension();
					newExtension.next_step = element?.target?.id;
					connectionExtension = newExtension;
				} else {
					const newExtension = new ConnectionExtension();
					newExtension.type = element.type;
					connectionExtension = newExtension;
				}

				coordinatesExtension.outgoing_connections.push(connectionExtension);
			}
			fillCoordinates(connectionExtension, element as Connection);
		} else {
			//is Shape
			const shape = element as Shape;
			const workflowstep = this.playbook.workflow[element?.id];
			if (workflowstep === undefined) {
				throw Error('the shape does not correspond to any workflow step');
			}
			if (workflowstep.step_extensions === undefined) {
				workflowstep.step_extensions = [];
			}

			workflowstep.step_extensions[CoordinatesExtensionIdentifier] =
				new CoordinatesExtension();

			const coordinatesExtension: CoordinatesExtension =
				workflowstep.step_extensions[CoordinatesExtensionIdentifier];

			coordinatesExtension.height = shape.height;
			coordinatesExtension.width = shape.width;
			coordinatesExtension.x = shape.x;
			coordinatesExtension.y = shape.y;
		}
	}

	/**
	 * This method removes the coordinates extension from the provided workflow step or its outgoing connections.
	 * @param element - The element to remove the coordinates extension from.
	 */
	removeCoordinatesExtension(element: Shape | Connection) {
		if (element.waypoints) {
			//is Connection
			const workflowstep = this.playbook.workflow[element?.source?.id];
			if (workflowstep === undefined) {
				throw Error('the connection\'s source does not correspond to any workflow step');
			}
			if (workflowstep.step_extensions === undefined) {
				workflowstep.step_extensions = [];
			}
			if (workflowstep.step_extensions[CoordinatesExtensionIdentifier] === undefined) {
				workflowstep.step_extensions[CoordinatesExtensionIdentifier] =
					new CoordinatesExtension();
			}
			delete workflowstep.step_extensions[CoordinatesExtensionIdentifier];
		} else {
			//is Shape
			const workflowstep = this.playbook.workflow[element?.id];
			if (workflowstep === undefined) {
				throw Error('the shape does not correspond to any workflow step');
			}
			if (workflowstep.step_extensions === undefined) {
				workflowstep.step_extensions = [];
			}
			if (workflowstep.step_extensions[CoordinatesExtensionIdentifier] === undefined) {
				workflowstep.step_extensions[CoordinatesExtensionIdentifier] =
					new CoordinatesExtension();
			}
			delete workflowstep.step_extensions[CoordinatesExtensionIdentifier];
		}
	}

	/**
	 * Get coordinates extension for a step, with caching
	 * @param stepId The ID of the workflow step
	 * @returns The coordinates extension or undefined
	 */
	getCoordinatesExtension(stepId: string): CoordinatesExtension | undefined {
		// Return from cache if available
		if (PlaybookHandler._coordinatesCache[stepId]) {
			return PlaybookHandler._coordinatesCache[stepId];
		}

		const workflowstep = this.playbook.workflow[stepId];
		if (!workflowstep || !workflowstep.step_extensions) {
			return undefined;
		}

		const extension = workflowstep.step_extensions[CoordinatesExtensionIdentifier];
		if (extension) {
			// Cache the result
			PlaybookHandler._coordinatesCache[stepId] = extension;
		}

		return extension;
	}

	/**
	 * this method create a derived playbook of the playbook stored
	 * @returns
	 */
	createDerivedPlaybook(): Playbook {
		const derivedPlaybook = new Playbook(this.playbook);

		derivedPlaybook.id = `playbook--${uuidv4()}`;
		derivedPlaybook.derived_from.push(this.playbook.id);
		derivedPlaybook.created_by = UserSettingsProps.instance.identifier;

		const currentDate = new Date().toISOString();
		derivedPlaybook.created = currentDate;
		derivedPlaybook.modified = currentDate;

		return derivedPlaybook;
	}

	/**
	 * Retrieves the integration log.
	 *
	 * @returns The integration log.
	 */
	getIntegrationLog(): IntegrationLog {
		return this._integrationLog;
	}

	/**
	 * Clear the coordinates cache
	 * Should be called when loading a new playbook or when coordinates are updated
	 */
	clearCoordinatesCache(): void {
		PlaybookHandler._coordinatesCache = {};
	}

	/**
	 * Triggers validation by firing a 'playbook.changed' event
	 * Used to update the validation state after operations like export
	 */
	triggerValidation() {
		const context: ContextPlaybookAttrs = {
			action: 'update.metadata',
			element: this._playbook as any,
		};
		this._eventBus.fire('playbook.changed', context);
	}
}

PlaybookHandler.$inject = ['eventBus', 'config.playbook', 'config.executionStatus.json', 'elementRegistry'];
