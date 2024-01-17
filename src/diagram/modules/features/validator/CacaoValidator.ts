import PlaybookHandler from '../../model/PlaybookHandler';
import {
  schemaDictAgentTarget,
  schemaDictWithoutAgentTarget,
} from '../../model/SchemaTypes';
import Ajv2019 from 'ajv/dist/2019';
import draft7MetaSchema from 'ajv/dist/refs/json-schema-draft-07.json';
import EventBus from 'diagram-js/lib/core/EventBus';
import CacaoDialog from '../../core/CacaoDialog';
import CacaoUtils from '../../core/CacaoUtils';
import { Schema } from 'css-minimizer-webpack-plugin';

// [path,fileName,errorMessage]
type PlaybookError = [string, string, string];

export default class CacaoValidator {
  private _playbookHandler: PlaybookHandler;

  private _validatorContainer!: HTMLElement;
  private _validatorIcon!: HTMLElement;
  private _validatorMessage!: HTMLElement;

  static $inject: string[];

  constructor(
    playbookHandler: PlaybookHandler,
    eventBus: EventBus,
    container: HTMLElement,
  ) {
    this._playbookHandler = playbookHandler;

    eventBus.on(
      ['elements.changed', 'diagram.init', 'playbook.changed'],
      () => {
        this.validatePlaybook();
      },
    );

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

  private loadSchemas(avj: Ajv2019) {
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
    this.loadSchemas(ajv);
    const isValid = ajv.validate(
      schemaDictWithoutAgentTarget['playbook'],
      CacaoUtils.filterEmptyValues(this._playbookHandler.playbook),
    );
    if (isValid) {
      this.correct();
    } else {
      const processedErrors: PlaybookError[] = [];
      ajv.errors?.forEach(err => {
        const path = err.instancePath != '' ? err.instancePath + '/' : '';
        let file = err.parentSchema?.$id?.match(/\/([^/]+)\.[^.]+$/)?.[1];
        processedErrors.push([path, file ?? '', err.message ?? '']);
      });
      this.error(processedErrors);
    }
  }

  private correct() {
    this._validatorContainer.classList.remove('validator-error');
    this._validatorIcon.classList.remove('validator-icon-error');

    this._validatorContainer.classList.add('validator-correct');
    this._validatorIcon.classList.add('validator-icon-correct');

    this._validatorMessage.innerHTML = 'Valid Playbook';
    this._validatorContainer.onclick = () => {};
  }

  private error(errors: PlaybookError[]) {
    this._validatorContainer.classList.remove('validator-correct');
    this._validatorIcon.classList.remove('validator-icon-correct');

    this._validatorContainer.classList.add('validator-error');
    this._validatorIcon.classList.add('validator-icon-error');

    this._validatorMessage.innerHTML = `Invalid Playbook (${errors.length})`;
    this._validatorContainer.onclick = () => {
      this.showErrors(errors);
    };
  }

  private showErrors(errors: PlaybookError[]) {
    let modalContainer = document.createElement('div');

    errors.forEach((value: PlaybookError) => {
      let errorContainer = document.createElement('div');
      errorContainer.className = 'validator-dialog-error-container';
      errorContainer.innerHTML = `
                <h1 class="validator-dialog-error-title">${value[1]}</h1>
                <p class="validator-dialog-error-path">in ${value[0]}</p>
                <p class="validator-dialog-error-message">${value[2]}</p>
            `;
      modalContainer.appendChild(errorContainer);
    });

    CacaoDialog.showDialog('Playbook Errors', modalContainer);
  }
}

CacaoValidator.$inject = [
  'playbookHandler',
  'eventBus',
  'config.canvas.container',
];
