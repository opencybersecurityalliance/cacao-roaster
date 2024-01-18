import Canvas from 'diagram-js/lib/core/Canvas';
import PlaybookHandler from '../../model/PlaybookHandler';
import { query as domQuery, remove as domRemove } from 'min-dom';

import { innerSVG } from 'tiny-svg';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import CacaoUtils from '../../core/CacaoUtils';

import { CheckboxInput } from '../side-panel/BasicInputs/CheckboxInput';
import { LabeledInput } from '../side-panel/LabeledInput';
import { PanelButton } from '../side-panel/PanelButton';
import {
  CoordinatesExtensionDefinition,
  CoordinatesExtensionIdentifier,
} from '../../model/SchemaTypes';

export type ExportPreferences = {
  exportWithCoordinates: boolean;
};

/**
 *
 */
export default class CacaoExporter {
  private _playbookHandler: PlaybookHandler;
  private _elementRegistry: ElementRegistry;
  private _canvas: Canvas;

  static $inject: string[];
  constructor(
    playbookHandler: PlaybookHandler,
    elementRegistry: ElementRegistry,
    canvas: Canvas,
  ) {
    this._canvas = canvas;
    this._playbookHandler = playbookHandler;
    this._elementRegistry = elementRegistry;
  }

  private downloadFile(data: string, fileName: string, fileType: string): void {
    const blob = new Blob([data], { type: fileType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }

  /**
   * will show a dialog to allow the suer to make choices about the export, for now it is just chosing if he want to include the coordinates extension in the exported playbook
   */
  openExportPreferencesDialog() {
    let prefs: ExportPreferences = {
      exportWithCoordinates: false,
    };

    let dialog = document.createElement('dialog');
    dialog.classList.add('cacaoDialog');
    let titleContainer = document.createElement('div');
    titleContainer.innerHTML = 'Export';
    titleContainer.classList.add('cacaoDialog__title');

    let descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('cacaoDialog__message');

    if (!this._playbookHandler.isUserTheOwner) {
      if (
        this._playbookHandler.playbook.extension_definitions[
          CoordinatesExtensionIdentifier
        ]
      ) {
        for (let element of this._elementRegistry.getAll()) {
          if (
            CacaoUtils.isConnectionType(element.type) ||
            CacaoUtils.isConstructType(element.type)
          ) {
            this._playbookHandler.updateCoordinatesExtension(element as any);
          }
        }
      }

      if (this._playbookHandler.isPlaybookChanged) {
        descriptionContainer.innerHTML =
          'You have modified a playbook that is not yours. This action will create a new playbook.';
      } else {
        descriptionContainer.innerHTML =
          'You are not the creator of the playbook and you have not modified it. If you want to include the coordinates extension in the exported playbook, it will represent a modification; thus, a new playbook will be created.';
      }
      if (
        this._playbookHandler.playbook.extension_definitions[
          CoordinatesExtensionIdentifier
        ]
      ) {
        descriptionContainer.innerHTML +=
          ' Beware: The original playbook had the coordinate extension included. Not including it when exporting will create a new playbook';
      } else {
        descriptionContainer.innerHTML +=
          " Beware: The original playbook didn't have the coordinate extension included. Including it when exporting will create a new playbook";
      }
    }

    let messageContainer = document.createElement('div');
    messageContainer.classList.add('cacaoDialog__labels');

    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('cacaoDialog__buttonList');

    let checkboxExportCoordinates = new CheckboxInput(
      'exportWithCoordinates',
      false,
      true,
      false,
    );
    let checkboxLabeledInput = new LabeledInput(
      'Export with the coordinates extension',
      messageContainer,
    );
    checkboxLabeledInput.setBasicInput(checkboxExportCoordinates);

    checkboxLabeledInput.setUpdate(() => {
      prefs.exportWithCoordinates = checkboxExportCoordinates.submit();
    });

    let button = new PanelButton('Ok', buttonContainer, () => {
      this.exportToJson(prefs);
      dialog.close();
      dialog.remove();
    });
    button.addClass('buttonList__button');
    button.addClass('button--primary');

    checkboxLabeledInput.addToContainer();
    button.addToContainer();
    dialog.appendChild(titleContainer);
    dialog.appendChild(descriptionContainer);
    dialog.appendChild(messageContainer);
    dialog.appendChild(buttonContainer);

    document.body.appendChild(dialog);
    dialog.showModal();
  }

  /**
   * export the playbook in JSON, if the user is not the owner of the playbook and he modified it, it will create a derived playbook
   * @param prefs
   */
  exportToJson(prefs: ExportPreferences) {
    if (prefs.exportWithCoordinates) {
      this._playbookHandler.playbook.extension_definitions[
        CoordinatesExtensionIdentifier
      ] = CoordinatesExtensionDefinition;
    } else if (
      this._playbookHandler.playbook.extension_definitions[
        CoordinatesExtensionIdentifier
      ]
    ) {
      delete this._playbookHandler.playbook.extension_definitions[
        CoordinatesExtensionIdentifier
      ];
    }

    if (
      !this._playbookHandler.isUserTheOwner &&
      this._playbookHandler.isPlaybookChanged
    ) {
      this._playbookHandler.setPlaybookProperties(
        this._playbookHandler.createDerivedPlaybook(),
      );
    }

    for (let element of this._elementRegistry.getAll()) {
      if (
        CacaoUtils.isConnectionType(element.type) ||
        CacaoUtils.isConstructType(element.type)
      ) {
        if (prefs.exportWithCoordinates) {
          this._playbookHandler.updateCoordinatesExtension(element as any);
        } else {
          this._playbookHandler.removeCoordinatesExtension(element as any);
        }
      }
    }
    this._playbookHandler.setPlaybookDates();
    this._playbookHandler.initialPlaybook = this._playbookHandler.playbook;

    const jsonObject = CacaoUtils.filterEmptyValues(
      this._playbookHandler.playbook,
    );
    let playbookId = this._playbookHandler.playbook.id;
    let playbookModified = this._playbookHandler.playbook.modified;
    let fileName = playbookId + '__' + playbookModified + '.json';

    this.downloadFile(
      JSON.stringify(jsonObject, null, 2),
      fileName,
      'application/json',
    );

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

  /**
   * export the playbook in svg
   */
  exportToSVG() {
    let svg: string = '';
    let err;

    try {
      let contentNode = this._canvas.getActiveLayer();

      let contents = innerSVG(contentNode as any);

      const bbox = (contentNode as any).getBBox();

      let defsNode = domQuery('defs', (this._canvas as any)._svg);
      let defs = defsNode ? '<defs>' + innerSVG(defsNode) + '</defs>' : '';

      svg =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<!-- created using CACAO Roaster -->\n' +
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' +
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
        'width="' +
        bbox.width +
        '" height="' +
        bbox.height +
        '" ' +
        'viewBox="' +
        bbox.x +
        ' ' +
        bbox.y +
        ' ' +
        bbox.width +
        ' ' +
        bbox.height +
        '" version="1.1">' +
        defs +
        contents +
        '</svg>';
    } catch (e) {
      err = e;
    }

    if (err) {
      throw err;
    }
    let playbookName = this._playbookHandler.playbook.name;
    let fileName = playbookName ? playbookName + '.svg' : 'playbook.svg';
    this.downloadFile(svg, fileName, 'image/svg+xml;charset=utf-8');
  }
}

CacaoExporter.$inject = ['playbookHandler', 'elementRegistry', 'canvas'];
