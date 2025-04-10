import type PlaybookHandler from '../../model/PlaybookHandler';
import { schemaDictAgentTarget, schemaDictWithoutAgentTarget } from '../../model/SchemaTypes';
import Ajv2019 from 'ajv/dist/2019';
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import type EventBus from 'diagram-js/lib/core/EventBus';
import CacaoDialog from '../../core/CacaoDialog';
import CacaoUtils from '../../core/CacaoUtils';
import type { Schema } from 'css-minimizer-webpack-plugin';

// [path,fileName,errorMessage,isWarning]
type PlaybookError = [string, string, string, boolean?];

export default class CacaoValidator {
	private _playbookHandler: PlaybookHandler;
	private _validatorContainer!: HTMLElement;
	private _validatorIcon!: HTMLElement;
	private _validatorMessage!: HTMLElement;
	static $inject: string[];

	constructor(playbookHandler: PlaybookHandler, eventBus: EventBus, container: HTMLElement) {
		this._playbookHandler = playbookHandler;

		eventBus.on(['elements.changed', 'diagram.init', 'playbook.changed'], () => {
			this.validatePlaybook();
		});
		this.initContainer(container);
	}

	initContainer(container: HTMLElement) {
		this._validatorContainer = document.createElement('div');
		this._validatorContainer.className = 'validator-container';

		this._validatorIcon = document.createElement('div');
		this._validatorIcon.className = 'validator-icon';

		this._validatorMessage = document.createElement('div');
		this._validatorMessage.className = 'validator-message';

		container.appendChild(this._validatorContainer);
		this._validatorContainer.appendChild(this._validatorIcon);
		this._validatorContainer.appendChild(this._validatorMessage);
	}

	private _loadSchemas(avj: Ajv2019) {
		let schemas = Object.values(schemaDictWithoutAgentTarget) as Schema[];
		for (const schema of schemas) {
			avj.addSchema(schema);
		}
		schemas = Object.values(schemaDictAgentTarget) as Schema[];
		for (const schema of schemas) {
			avj.addSchema(schema);
		}
	}

	validatePlaybook() {
		const ajv = new Ajv2019({
			strict: false,
			allErrors: true,
			verbose: true,
			addUsedSchema: false,
		});
		ajv.addMetaSchema(draft7MetaSchema);
		this._loadSchemas(ajv);
		const isValid = ajv.validate(
			schemaDictWithoutAgentTarget.playbook,
			CacaoUtils.filterEmptyValues(this._playbookHandler.playbook),
		);
		if (isValid) {
			this._correct();
		} else {
			const processedErrors: PlaybookError[] = [];
			const errors = ajv.errors;
			if (!errors) return;
			
			// Process validation errors
			for (const err of errors) {
				const path = err.instancePath !== '' ? `${err.instancePath}/` : '';
				const file = err.parentSchema?.$id?.match(/\/([^/]+)\.[^.]+$/)?.[1];
				const message = err.message ?? '';
				
				// Check if this is a timestamp error
				const isTimestampError = this._isTimestampError([path, file ?? '', message]);
				
				// Add to processed errors with the warning flag for timestamp errors
				processedErrors.push([
					path, 
					file ?? '', 
					message, 
					isTimestampError
				]);
			}
			
			// Check if errors are only timestamp-related
			if (this._isOnlyTimestampErrors(processedErrors)) {
				this._warning(processedErrors);
			} else {
				this._error(processedErrors);
			}
		}
	}

	/**
	 * Determines if a specific error is related to missing timestamps
	 */
	private _isTimestampError(error: [string, string, string]): boolean {
		const [path, , message] = error;
		return (
			path === '' && 
			(message.includes('must have required property \'created\'') || 
			message.includes('must have required property \'modified\''))
		);
	}

	/**
	 * Determines which specific timestamp field is missing
	 */
	private _getMissingTimestampField(message: string): 'created' | 'modified' | null {
		if (message.includes('must have required property \'created\'')) {
			return 'created';
		} else if (message.includes('must have required property \'modified\'')) {
			return 'modified';
		}
		return null;
	}

	/**
	 * Determines if the only validation errors are related to missing timestamps
	 * (created and modified fields)
	 */
	private _isOnlyTimestampErrors(errors: PlaybookError[]): boolean {
		if (errors.length === 0) return false;
		
		// Check if all errors are about missing 'created' or 'modified' properties
		return errors.every(err => this._isTimestampError([err[0], err[1], err[2]]));
	}

	private _correct() {
		this._validatorContainer.classList.remove('validator-error');
		this._validatorIcon.classList.remove('validator-icon-error');
		this._validatorContainer.classList.remove('validator-warning');
		this._validatorIcon.classList.remove('validator-icon-warning');

		this._validatorContainer.classList.add('validator-correct');
		this._validatorIcon.classList.add('validator-icon-correct');

		this._validatorMessage.innerHTML = 'Valid Playbook';
		this._validatorContainer.onclick = () => {};
	}

	private _error(errors: PlaybookError[]) {
		this._validatorContainer.classList.remove('validator-correct');
		this._validatorIcon.classList.remove('validator-icon-correct');
		this._validatorContainer.classList.remove('validator-warning');
		this._validatorIcon.classList.remove('validator-icon-warning');

		this._validatorContainer.classList.add('validator-error');
		this._validatorIcon.classList.add('validator-icon-error');

		// Count actual errors (non-warnings)
		const errorCount = errors.filter(err => !err[3]).length;
		const warningCount = errors.filter(err => err[3]).length;

		this._validatorMessage.innerHTML = `Invalid Playbook (${errorCount} errors${warningCount > 0 ? `, ${warningCount} warnings` : ''})`;
		this._validatorContainer.onclick = () => {
			this.showErrors(errors);
		};
	}

	private _warning(warnings: PlaybookError[]) {
		this._validatorContainer.classList.remove('validator-correct');
		this._validatorIcon.classList.remove('validator-icon-correct');
		this._validatorContainer.classList.remove('validator-error');
		this._validatorIcon.classList.remove('validator-icon-error');

		this._validatorContainer.classList.add('validator-warning');
		this._validatorIcon.classList.add('validator-icon-warning');

		this._validatorMessage.innerHTML = `Playbook Warning (${warnings.length})`;
		this._validatorContainer.onclick = () => {
			this.showErrors(warnings);
		};
	}

	private showErrors(errors: PlaybookError[]) {
		const modalContainer = document.createElement('div');

		// Split errors and warnings
		const realErrors = errors.filter(err => !err[3]);
		const warnings = errors.filter(err => err[3]);

		// Show actual errors first (if any)
		for (const error of realErrors) {
			const errorContainer = document.createElement('div');
			errorContainer.className = 'validator-dialog-error-container';
			errorContainer.innerHTML = `
				<h1 class="validator-dialog-error-title">${error[1]}</h1>
				<p class="validator-dialog-error-path">in ${error[0]}</p>
				<p class="validator-dialog-error-message">${error[2]}</p>
			`;
			modalContainer.appendChild(errorContainer);
		}

		// Show warnings after errors
		for (const warning of warnings) {
			const warningContainer = document.createElement('div');
			warningContainer.className = 'validator-dialog-warning-container';
			
			// Check if this is a timestamp error
			const isTimestampError = this._isTimestampError([warning[0], warning[1], warning[2]]);
			
			let warningContent = `
				<h1 class="validator-dialog-error-title">${warning[1]}</h1>
				<p class="validator-dialog-error-path">in ${warning[0]}</p>
				<p class="validator-dialog-error-message">${warning[2]}</p>
			`;
			
			// Add timestamp explanation for timestamp errors with field-specific message
			if (isTimestampError) {
				const missingField = this._getMissingTimestampField(warning[2]);
				if (missingField === 'created') {
					warningContent += `
						<p class="validator-dialog-timestamp-message">
							Missing 'created' timestamp: This is normal for new playbooks. 
							The timestamp will be automatically added when you export the playbook.
						</p>
					`;
				} else if (missingField === 'modified') {
					warningContent += `
						<p class="validator-dialog-timestamp-message">
							Missing 'modified' timestamp: This is normal for new playbooks. 
							The timestamp will be automatically added when you export the playbook.
						</p>
					`;
				}
			}
			
			warningContainer.innerHTML = warningContent;
			modalContainer.appendChild(warningContainer);
		}

		CacaoDialog.showDialog('Playbook Errors', modalContainer);
	}
}

CacaoValidator.$inject = ['playbookHandler', 'eventBus', 'config.canvas.container'];
