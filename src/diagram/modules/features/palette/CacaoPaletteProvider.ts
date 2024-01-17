import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Palette, { EventBus } from 'diagram-js/lib/features/palette/Palette';
import Create from 'diagram-js/lib/features/create/Create';
import PaletteProvider, {
  PaletteEntry,
} from 'diagram-js/lib/features/palette/PaletteProvider';
import CacaoBaseConstruct, {
  CacaoConstructType,
} from '../../../elements/constructs/CacaoBaseConstruct';
import CacaoFactory from '../../factory/CacaoFactory';
import { v4 as uuidv4 } from 'uuid';
import CacaoRules from '../rules/CacaoRules';
import HandTool from 'diagram-js/lib/features/hand-tool/HandTool';
import SpaceTool from 'diagram-js/lib/features/space-tool/SpaceTool';
import LassoTool from 'diagram-js/lib/features/lasso-tool/LassoTool';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import CacaoUtils from '../../core/CacaoUtils';
import CacaoModeling from '../modeling/CacaoModeling';

type CacaoPaletteEntry = Omit<PaletteEntry, 'action'> & {
  action?: Record<string, (event: Event, autoActivate: boolean) => any>;
  className?: string;
  group?: string;
  html?: string;
  imageUrl?: string;
  separator?: boolean;
  title?: string;
};

type CacaoPaletteEntries = Record<string, CacaoPaletteEntry>;

/**
 * This class is a module
 * - module's entry points:
 *    - getConstructEntries(..)
 * - goal:
 *    - it provides the entries for the palette
 */
export default class CacaoPaletteProvider implements PaletteProvider {
  private _create: Create;
  private _eventBus: EventBus;
  private _elementFactory: ElementFactory;
  private _paletteExpanded!: boolean;
  private _cacaoRules: CacaoRules;
  private _paletteCreated = false;
  private _lassoTool: LassoTool;
  private _handTool: HandTool;
  private _spaceTool: SpaceTool;
  private _elementRegistry: ElementRegistry;
  private _cacaoModeling: CacaoModeling;

  static $inject: string[];

  constructor(
    palette: Palette,
    create: Create,
    eventBus: EventBus,
    elementFactory: ElementFactory,
    elementRegistry: ElementRegistry,
    modeling: CacaoModeling,
    cacaoRules: CacaoRules,
    spaceTool: SpaceTool,
    lassoTool: LassoTool,
    handTool: HandTool,
  ) {
    this._create = create;
    this._eventBus = eventBus;
    this._elementFactory = elementFactory;
    this._cacaoRules = cacaoRules;
    this._paletteExpanded = true;
    this._lassoTool = lassoTool;
    this._handTool = handTool;
    this._spaceTool = spaceTool;
    this._elementRegistry = elementRegistry;
    this._cacaoModeling = modeling;

    palette.registerProvider(this);

    eventBus.on('palette.update', () => {
      eventBus.fire('i18n.changed', {});
    });

    this.bindSwitcher();
  }

  bindSwitcher() {
    this._eventBus.on('palette.changed', (context: any) => {
      this.loadLabels();
      if (!this._paletteCreated) {
        this.expand();
        this._paletteCreated = true;
      }
    });
  }

  /**
   * create a palette's entry for the provided cacaoConstruct
   * @param cacaoConstruct the cacao construct concerned by the action
   * @param actionGroup
   * @returns the entry of the palette
   */
  createAction(
    cacaoConstruct: CacaoBaseConstruct,
    disable: boolean,
    actionGroup: string = 'event',
  ): CacaoPaletteEntry {
    let create: Create = this._create;
    let elementFactory: ElementFactory = this._elementFactory;

    let createListener = (event: any) => {
      var shape = {
        id: cacaoConstruct.properties.modelType + '--' + uuidv4(),
        type: cacaoConstruct.type,
        x: event.clientX,
        y: event.clientY,
        width: cacaoConstruct.properties.width,
        height: cacaoConstruct.properties.height,
      };
      create.start(event, shape, undefined);
    };

    let className = cacaoConstruct.properties.className + ' palette-entry';
    if (disable) {
      className += ' entry--disable';
    }
    if (this._paletteExpanded) {
      className += ' entry-expanded';
    }

    return {
      group: actionGroup,
      className: className,
      title: cacaoConstruct.properties.title,
      action: disable
        ? {}
        : {
            dragstart: (event: any) => {
              createListener(event);
            },
            click: (event: any) => {
              createListener(event);
            },
          },
    };
  }

  /**
   * create all the cacao construct entries for the palette
   * @returns the entries
   */
  getConstructEntries() {
    let entries: CacaoPaletteEntries = {};
    for (let type of Object.values(CacaoConstructType)) {
      let cacaoConstruct = CacaoFactory.getCacaoConstruct(undefined, type);
      if (cacaoConstruct) {
        let key: string = `create.${type}`;
        entries[key] = this.createAction(
          cacaoConstruct,
          !this._cacaoRules.canCreate(type),
        );
      }
    }
    return entries;
  }

  /**
   * return all the entries for the palette
   * @returns the entries
   */
  getPaletteEntries(): any {
    return {
      'hand-tool': {
        group: 'tools',
        className: 'bpmn-icon-hand-tool toolsentry',
        title: 'hand tools',
        action: {
          click: (event: any) => {
            this._handTool.activateHand(event, false, false);
          },
        },
      },
      'lasso-tool': {
        group: 'tools',
        className: 'bpmn-icon-lasso-tool toolsentry',
        title: 'lasso tool',
        action: {
          click: (event: any) => {
            this._lassoTool.activateSelection(event, false);
          },
        },
      },
      'space-tool': {
        group: 'tools',
        className: 'bpmn-icon-space-tool toolsentry',
        title: 'space tool',
        action: {
          click: (event: any) => {
            this._spaceTool.activateSelection(event, false, false);
          },
        },
      },
      ...this.getConstructEntries(),
      switcher: {
        group: 'switcher',
        className: this._paletteExpanded
          ? 'switcher palette-entry entry-expanded'
          : 'switcher palette-entry',
        title: '',
        action: {
          click: (event: any) => {
            if (this._paletteExpanded) {
              this.collapse();
            } else {
              this.expand();
            }
          },
        },
      },
    };
  }

  collapse() {
    let entries = document.getElementsByClassName('palette-entry');
    let container = document.getElementsByClassName('djs-palette');
    container[0]?.classList.remove('palette--expanded');
    this._paletteExpanded = false;
    for (let i = 0; i < entries.length; i++) {
      entries.item(i)?.classList.remove('entry-expanded');
    }
  }

  expand() {
    let entries = document.getElementsByClassName('palette-entry');
    let container = document.getElementsByClassName('djs-palette');
    container[0]?.classList.add('palette--expanded');
    this._paletteExpanded = true;
    for (let i = 0; i < entries.length; i++) {
      entries.item(i)?.classList.add('entry-expanded');
    }
  }

  loadLabels() {
    let entries = document.getElementsByClassName('palette-entry');
    for (let i = 0; i < entries.length; i++) {
      let entry = entries.item(i);
      if (entry) {
        let title = (entries.item(i) as any)?.title ?? '';
        entry.innerHTML = `<p class="entry-label">${title}</p>`;
      }
    }
  }
}

CacaoPaletteProvider.$inject = [
  'palette',
  'create',
  'eventBus',
  'elementFactory',
  'elementRegistry',
  'modeling',
  'cacaoRules',
  'spaceTool',
  'lassoTool',
  'handTool',
];
