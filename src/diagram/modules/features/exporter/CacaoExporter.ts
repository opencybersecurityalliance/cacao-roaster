import Canvas from 'diagram-js/lib/core/Canvas';
import PlaybookHandler from '../../model/PlaybookHandler';
import { query as domQuery, remove as domRemove } from 'min-dom';
import { innerSVG } from 'tiny-svg';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import CacaoUtils from '../../core/CacaoUtils';
import { CheckboxInput } from '../side-panel/BasicInputs/CheckboxInput';
import { LabeledInput } from '../side-panel/LabeledInput';
import { PanelButton } from '../side-panel/PanelButton';
import { v4 as uuidv4 } from 'uuid';
import { Playbook } from 'lib/cacao2-js';
import {
  CoordinatesExtensionDefinition,
  CoordinatesExtensionIdentifier,
} from '../../model/SchemaTypes';

// Constants with text for the different scenarios.
const COORDINATES_EXTENSION_CONFIRMATION = `Beware: The original playbook had the coordinate extension included. Not including it when exporting will create a new playbook.`;
const COORDINATES_EXTENSION_REMOVAL_CONFIRMATION = `Beware: The original playbook didn't have the coordinate extension included. Including it when exporting will create a new playbook.`;
const NOT_OWNER_MODIFIED_MESSAGE =
  'You have modified a playbook that is not yours. This action will create a new playbook.';
const NOT_OWNER_NOT_MODIFIED_MESSAGE = `You are not the creator of the playbook and you have not modified it. If you want to include the coordinates extension in the exported playbook, it will represent a modification; thus, a new playbook will be created.`;
// A type deciding if the export is in CACAO JSON or STIX JSON.
type exportType = 'CACAO JSON' | 'STIX 2.1 JSON';

export default class CacaoExporter {
  private _playbookHandler: PlaybookHandler;
  private _elementRegistry: ElementRegistry;
  private _canvas: Canvas;
  static $inject: string[];

  constructor(playbookHandler: PlaybookHandler, elementRegistry: ElementRegistry, canvas: Canvas) {
    this._canvas = canvas;
    this._playbookHandler = playbookHandler;
    this._elementRegistry = elementRegistry;
  }

  /**
   * Shows a dialog allowing the user to make choices about the export. E.g. if to include the coordinates extension in the exported playbook.
   */
  openExportPreferencesDialog(exportType: exportType): void {
    let exportWithCoordinates = false;

    // Dialog Elements
    const dialog = document.createElement('dialog');
    dialog.className = 'cacaoDialog';
    const titleContainer = this.elementWithText('div', 'Export', 'cacaoDialog__title');
    const descriptionContainer = this.elementWithText('div', '', 'cacaoDialog__message');

    // Updates dialog description based on playbook modifications and coordinates preferences
    this.updateDialogDescription(descriptionContainer);

    let messageContainer = document.createElement('div');
    messageContainer.classList.add('cacaoDialog__labels');

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('cacaoDialog__buttonList');

    let checkboxExportCoordinates = new CheckboxInput('exportWithCoordinates', false, true, false);
    let checkboxLabeledInput = new LabeledInput(
      'Export with the coordinates extension',
      messageContainer,
    );
    checkboxLabeledInput.setBasicInput(checkboxExportCoordinates);
    checkboxLabeledInput.setUpdate(() => {
      exportWithCoordinates = checkboxExportCoordinates.submit();
    });

    // Create OK Button and its handler
    let button = new PanelButton('Ok', buttonContainer, () => {
      exportType === 'CACAO JSON'
        ? this.exportToJson(exportWithCoordinates)
        : this.exportToStixJson(exportWithCoordinates);
      dialog.close();
      dialog.remove();
    });
    button.addClass('buttonList__button');
    button.addClass('button--primary');

    checkboxLabeledInput.addToContainer();
    button.addToContainer();
    // Append all elements to the dialog
    [titleContainer, descriptionContainer, messageContainer, buttonContainer].forEach(el =>
      dialog.appendChild(el),
    );

    // Display the dialog
    document.body.appendChild(dialog);
    dialog.showModal();
  }

  /**
   * export the playbook in JSON, if the user is not the owner of the playbook and he modified it, it will create a derived playbook
   * @param prefs
   */
  exportToJson(exportWithCoordinates: boolean) {
    this.preparesExportWithCoordinatesOrRemovesThem(exportWithCoordinates);
    this._playbookHandler.setPlaybookDates();
    this._playbookHandler.initialPlaybook = this._playbookHandler.playbook;

    const jsonObject = CacaoUtils.filterEmptyValues(this._playbookHandler.playbook);
    let playbookId = this._playbookHandler.playbook.id;
    let playbookModified = this._playbookHandler.playbook.modified;
    let fileName = playbookId + '__' + playbookModified + '.json';

    this.downloadFile(JSON.stringify(jsonObject, null, 2), fileName, 'application/json');

    if (this._playbookHandler.hasExecutionStatus()) {
      const jsonObject2 = CacaoUtils.filterEmptyValues(
        this._playbookHandler.getPlaybookAndStatus(),
      );
      this.downloadFile(
        JSON.stringify(jsonObject2, null, 2),
        'status--' + fileName,
        'application/json',
      );
    }
  }

  // Export the playbook as svg.
  exportToSVG() {
    let svg: string = '';

    try {
      let contentNode = this._canvas.getActiveLayer();
      let contents = innerSVG(contentNode as any);
      const bbox = (contentNode as any).getBBox();

      let defsNode = domQuery('defs', (this._canvas as any)._svg);
      let defs = defsNode ? '<defs>' + innerSVG(defsNode) + '</defs>' : '';

      svg = `<?xml version="1.0" encoding="utf-8"?><!-- created using CACAO Roaster --><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${bbox.width}" height="${bbox.height}" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}" version="1.1">${defs}${contents}</svg>`;
    } catch (e) {
      throw e;
    }

    let playbookName = this._playbookHandler.playbook.name;
    let fileName = playbookName ? playbookName + '.svg' : 'playbook.svg';
    this.downloadFile(svg, fileName, 'image/svg+xml;charset=utf-8');
  }

  /**
   * Export the CACAO playbook in STIX 2.1 JSON by utilizing the STIX 2.1 playbook extension (from https://github.com/cyentific-rni/stix2.1-coa-playbook-extension/tree/main).
   * If the user is not the owner of the playbook and he modified it, it will create a derived playbook.
   * @param prefs
   */
  exportToStixJson(exportWithCoordinates: boolean) {
    this.preparesExportWithCoordinatesOrRemovesThem(exportWithCoordinates);
    this._playbookHandler.setPlaybookDates();
    this._playbookHandler.initialPlaybook = this._playbookHandler.playbook;

    // Generating the ID and filename for the COA object.
    let coaID = 'course-of-action--' + uuidv4();
    let fileName = coaID + '.json';

    // Createing STIX 2.1 COA object with Playbook extension.
    let stixPlaybook = this.createStixCoaWithPlaybookExtension(
      this._playbookHandler.playbook,
      coaID,
    );
    // Remove properties with no values
    stixPlaybook = CacaoUtils.filterEmptyValues(stixPlaybook);

    // Download the JSON file
    this.downloadFile(JSON.stringify(stixPlaybook, null, 2), fileName, 'application/json');
  }

  // Creates a STIX 2.1 Course of Action object with the Playbook extension and attaches the relevant metadata and the whole CACAO playbook in base64 in the "playbook_base64" property.
  private createStixCoaWithPlaybookExtension(cacaoPlaybook: Playbook, coaID: string): object {
    return {
      type: 'course-of-action',
      spec_version: '2.1',
      id: coaID,
      created_by_ref: cacaoPlaybook.created_by,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      name: 'playbook',
      description: cacaoPlaybook.description,
      extensions: {
        'extension-definition--1e1c1bd7-c527-4215-8e18-e199e74da57c': {
          extension_type: 'property-extension',
          playbook_id: cacaoPlaybook.id,
          created: cacaoPlaybook.created,
          modified: cacaoPlaybook.modified,
          playbook_creator: cacaoPlaybook.created_by,
          revoked: cacaoPlaybook.revoked,
          labels: cacaoPlaybook.labels,
          description: cacaoPlaybook.description,
          playbook_valid_from: cacaoPlaybook.valid_from,
          playbook_valid_until: cacaoPlaybook.valid_until,
          playbook_creation_time: cacaoPlaybook.created,
          playbook_impact: cacaoPlaybook.impact,
          playbook_severity: cacaoPlaybook.severity,
          playbook_priority: cacaoPlaybook.priority,
          playbook_type: cacaoPlaybook.playbook_types,
          playbook_standard: 'cacao',
          playbook_abstraction: 'template',
          playbook_base64: Buffer.from(
            JSON.stringify(CacaoUtils.filterEmptyValues(cacaoPlaybook)),
          ).toString('base64'),
        },
      },
    };
  }

  private downloadFile(data: string, fileName: string, fileType: string): void {
    const blob = new Blob([data], { type: fileType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  /**
   * Creates an HTML element with text and class.
   */
  private elementWithText(tag: string, text: string, className: string): HTMLElement {
    const element = document.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
  }

  /**
   * Updates the dialog description based on the user's permissions and choices.
   */
  private updateDialogDescription(descriptionContainer: HTMLElement): void {
    const hasCoordinatesExtension =
      !!this._playbookHandler.playbook.extension_definitions[CoordinatesExtensionIdentifier];

    // User is not the owner of the playbook
    if (!this._playbookHandler.isUserTheOwner) {
      if (this._playbookHandler.isPlaybookChanged) {
        descriptionContainer.textContent = NOT_OWNER_MODIFIED_MESSAGE;
      } else {
        descriptionContainer.textContent = NOT_OWNER_NOT_MODIFIED_MESSAGE;
      }
      descriptionContainer.textContent += hasCoordinatesExtension
        ? COORDINATES_EXTENSION_CONFIRMATION
        : COORDINATES_EXTENSION_REMOVAL_CONFIRMATION;
    }
  }

  /**
   * If the @param exportWithCoordinates is true: Adding the extension definition for coordinates and the coordinates themselves, otherwise they gets removed from the produced output.
   */
  private preparesExportWithCoordinatesOrRemovesThem(exportWithCoordinates: boolean) {
    if (exportWithCoordinates) {
      this._playbookHandler.playbook.extension_definitions[CoordinatesExtensionIdentifier] =
        CoordinatesExtensionDefinition;
    } else if (
      this._playbookHandler.playbook.extension_definitions[CoordinatesExtensionIdentifier]
    ) {
      delete this._playbookHandler.playbook.extension_definitions[CoordinatesExtensionIdentifier];
    }
    if (!this._playbookHandler.isUserTheOwner && this._playbookHandler.isPlaybookChanged) {
      this._playbookHandler.setPlaybookProperties(this._playbookHandler.createDerivedPlaybook());
    }

    for (let element of this._elementRegistry.getAll()) {
      if (CacaoUtils.isConnectionType(element.type) || CacaoUtils.isConstructType(element.type)) {
        if (exportWithCoordinates) {
          this._playbookHandler.updateCoordinatesExtension(element as any);
        } else {
          this._playbookHandler.removeCoordinatesExtension(element as any);
        }
      }
    }
  }
}

CacaoExporter.$inject = ['playbookHandler', 'elementRegistry', 'canvas'];
