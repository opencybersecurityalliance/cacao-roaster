import ContextPadProvider from 'diagram-js/lib/features/context-pad/ContextPadProvider';
import ContextPad, {
  ContextPadEntries,
  ContextPadTarget,
} from 'diagram-js/lib/features/context-pad/ContextPad';
import CacaoBaseConnection, {
  CacaoConnectionType,
} from '../../../elements/connections/CacaoBaseConnection';
import CacaoUtils from '../../core/CacaoUtils';
import CacaoBaseConstruct, {
  CacaoConstructType,
} from '../../../elements/constructs/CacaoBaseConstruct';
import {
  Connection,
  Element,
  Shape,
  ShapeLike,
} from 'diagram-js/lib/model/Types';
import { assign } from 'min-dash';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import Create from 'diagram-js/lib/features/create/Create';
import CacaoModeling from '../modeling/CacaoModeling';
import CacaoRules from '../rules/CacaoRules';
import CacaoAutoPlace from '../auto-place/CacaoAutoPlace';
import CacaoFactory from '../../factory/CacaoFactory';
import CacaoConnect from '../connect/CacaoConnect';
import { v4 as uuidv4 } from 'uuid';
import EventBus from 'diagram-js/lib/core/EventBus';
import PlaybookHandler, {
  ContextPlaybookAttrs,
} from '../../model/PlaybookHandler';
import CacaoDialog from '../../core/CacaoDialog';
import SelectionHandler from 'diagram-js/lib/features/selection/Selection';
import CacaoSidePanel from '../side-panel/CacaoSidePanel';

/**
 * This class is a module
 * - module's entry points:
 *    - getContextPadEntries(..) & getMultiElementContextPadEntries(...)
 * - goal:
 *    - it provides entries for the contextual menu of a shape/connection
 */
export default class CacaoContextPad implements ContextPadProvider<Element> {
  _modeling: CacaoModeling;
  _elementFactory: ElementFactory;
  _create: Create;
  _cacaoAutoPlace: CacaoAutoPlace;
  _cacaoRules: CacaoRules;
  _cacaoConnect: CacaoConnect;
  _playbookHandler: PlaybookHandler;

  _currentTarget: undefined | ContextPadTarget<Element>;

  static $inject: string[];

  constructor(
    modeling: CacaoModeling,
    elementFactory: ElementFactory,
    create: Create,
    contextPad: ContextPad,
    cacaoAutoPlace: CacaoAutoPlace,
    cacaoRules: CacaoRules,
    cacaoConnect: CacaoConnect,
    eventBus: EventBus,
    playbookHandler: PlaybookHandler,
    selection: SelectionHandler,
    cacaoSidePanel: CacaoSidePanel,
  ) {
    this._modeling = modeling;
    this._elementFactory = elementFactory;
    this._create = create;
    this._cacaoAutoPlace = cacaoAutoPlace;
    this._cacaoRules = cacaoRules;
    this._cacaoConnect = cacaoConnect;
    eventBus.on('playbook.changed', (context: ContextPlaybookAttrs) => {
      if (!context || !context.action || !context.element) {
        return;
      }
      if (context.action == 'add.shape') {
        if (!selection.isSelected(context.element)) {
          selection.select(context.element);
        }
      }
    });
    this._playbookHandler = playbookHandler;
    contextPad.registerProvider(this);
  }

  /**
   * this method returns the entries of the context pad
   * @param element
   * @returns the contextpad entries
   */
  getContextPadEntries(element: Element): any {
    let type: CacaoConstructType | CacaoConnectionType | undefined;
    let entries: ContextPadEntries = {};

    type = CacaoUtils.getTypeOfElement(element);
    if (!type) {
      //if not defined
      return entries;
    }

    if (CacaoUtils.isConnectionType(type)) {
      assign(entries, {
        ...this.getRemoveEntry(),
        ...this.getCacaoConnectionEntries(element),
      });
    }

    if (CacaoUtils.isConstructType(type)) {
      assign(entries, {
        ...this.getRemoveEntry(),
      });
      assign(entries, {
        ...this.getCacaoConstructEntries(element),
        ...this.getConnectToolEntries(element),
      });
    }
    return entries;
  }

  getMultiElementContextPadEntries(elements: Element[]): any {
    let isConstruct = true;
    for (let element of elements) {
      if (
        !CacaoUtils.isConstructType(element?.type) &&
        !CacaoUtils.isConnectionType(element?.type)
      ) {
        isConstruct = false;
      }
    }
    if (isConstruct) {
      return {
        ...this.getRemoveEntries(),
      };
    }
    return {};
  }

  private getCacaoConstructEntry(
    cacaoConstruct: CacaoBaseConstruct,
    actionGroup: string = 'model',
  ): any {
    let create: Create = this._create;
    let elementFactory: ElementFactory = this._elementFactory;
    let cacaoAutoPlace: CacaoAutoPlace = this._cacaoAutoPlace;
    let cacaoRules: CacaoRules = this._cacaoRules;

    function dragListener(event: any, element: ShapeLike) {
      var newShape = {
        id: cacaoConstruct.properties.modelType + '--' + uuidv4(),
        type: cacaoConstruct.type,
        x: event.clientX,
        y: event.clientY,
        width: cacaoConstruct.properties.width,
        height: cacaoConstruct.properties.height,
      };
      create.start(event, newShape, {
        source: element,
      });
    }

    function clickListener(event: any, element: Shape) {
      let newShape: any = {
        id: cacaoConstruct.properties.modelType + '--' + uuidv4(),
        type: cacaoConstruct.type,
        x: event.clientX,
        y: event.clientY,
        width: cacaoConstruct.properties.width,
        height: cacaoConstruct.properties.height,
      };
      let connectionType = cacaoRules.canConnectToShapeType(
        element,
        cacaoConstruct.type,
      );
      if (connectionType) {
        let connection: Partial<Connection> = { type: connectionType };
        cacaoAutoPlace.appendShape(element, newShape, connection);
      }
    }

    return {
      group: actionGroup,
      className: cacaoConstruct.properties.className,
      title: cacaoConstruct.properties.title,
      action: {
        dragstart: dragListener,
        click: clickListener,
      },
    };
  }

  private getCacaoConstructEntries(element: Element) {
    let entries: ContextPadEntries = {};

    for (let type of Object.values(CacaoConstructType)) {
      let cacaoConstruct = CacaoFactory.getCacaoConstruct(undefined, type);
      if (!cacaoConstruct) {
        continue;
      }
      let connectionType = this._cacaoRules.canConnectToShapeType(
        element,
        type,
      );
      if (connectionType) {
        let key: string = `create.${type}`;
        entries[key] = this.getCacaoConstructEntry(cacaoConstruct);
      }
    }
    return entries;
  }

  private getCacaoConnectionEntry(
    cacaoConnection: CacaoBaseConnection,
    actionGroup: string = 'model',
  ): any {
    let modeling = this._modeling;

    function clickListener(event: any, element: Connection) {
      modeling.updateConnectionType(element, cacaoConnection.type);
    }

    return {
      group: actionGroup,
      className: cacaoConnection.properties.className,
      title: cacaoConnection.type,
      action: {
        click: clickListener,
      },
    };
  }

  private getCacaoConnectionEntries(element: Element) {
    let entries: ContextPadEntries = {};

    let cacaoConnection = CacaoFactory.getCacaoConnection(element);

    if (!cacaoConnection) {
      // If not a cacao connection
      return entries;
    }

    let source = cacaoConnection.source;
    let target = cacaoConnection.target;

    if (!source || !target) {
      // If source/target not defined
      return entries;
    }

    for (let type of Object.values(CacaoConnectionType)) {
      let cacaoConnectionEntry = CacaoFactory.getCacaoConnection(
        undefined,
        type,
      );
      if (
        cacaoConnectionEntry &&
        this._cacaoRules.canChangeConnectionType(
          source,
          target,
          cacaoConnection.type,
          type,
        )
      ) {
        let key: string = `create.${type}`;
        entries[key] = this.getCacaoConnectionEntry(cacaoConnectionEntry);
      }
    }
    return entries;
  }

  private getConnectToolEntry(cacaoConnection: CacaoBaseConnection): any {
    let self = this;
    function connectHandler(event: any, element: Element) {
      self._cacaoConnect.start(event, element, cacaoConnection.type);
    }
    return {
      group: 'tools',
      className: cacaoConnection.properties.className,
      title: cacaoConnection.type,
      action: {
        dragstart: connectHandler,
        click: connectHandler,
      },
    };
  }

  /**
   * Return the entries for all the connection type available
   * @param element
   * @returns
   */
  private getConnectToolEntries(element: Element) {
    let entries: ContextPadEntries = {};

    let cacaoConstruct = CacaoFactory.getCacaoConstruct(element);

    if (!cacaoConstruct) {
      // If not a cacao construct
      return entries;
    }

    for (let type of Object.values(CacaoConnectionType)) {
      let cacaoConnectionEntry = CacaoFactory.getCacaoConnection(
        undefined,
        type,
      );
      if (
        cacaoConnectionEntry &&
        this._cacaoRules.canStartConnect(element, type)
      ) {
        let key: string = `connect.${type}`;
        entries[key] = this.getConnectToolEntry(cacaoConnectionEntry);
      }
    }
    return entries;
  }

  private getRemoveEntry() {
    let self = this;
    let removeHandler = async (e: any, element: Element) => {
      if (CacaoUtils.isConstructType(element.type)) {
        if (
          Object.keys(
            CacaoUtils.filterEmptyValues(
              this._playbookHandler.getStep(element.id),
            ),
          ).length > 2
        ) {
          if (
            !(await CacaoDialog.showConfirm(
              'Are you sure you want to remove this step?',
              'You will not be able to undo this action.',
            ))
          ) {
            return;
          }
        }
      }
      self._modeling.removeElements([element]);
    };
    return {
      remover: {
        group: 'tool',
        className: 'bin',
        title: 'remove',
        action: {
          click: removeHandler,
        },
      },
    };
  }

  private getRemoveEntries() {
    let self = this;
    let removeHandler = async (e: any, elements: Element[]) => {
      if (
        !(await CacaoDialog.showConfirm(
          'Are you sure you want to remove this step?',
          'You will not be able to undo this action.',
        ))
      ) {
        return;
      }
      for (let element of elements) {
        if (
          !CacaoUtils.isConstructType(element.type) &&
          !CacaoUtils.isConnectionType(element.type)
        ) {
          return;
        }
      }
      elements = elements.sort((a: Element, b: Element) =>
        CacaoUtils.isConnectionType(a.type) ? -1 : 1,
      );
      self._modeling.removeElements(elements.slice());
    };
    return {
      remover: {
        group: 'tool',
        className: 'bin',
        title: 'remove',
        action: {
          click: removeHandler,
        },
      },
    };
  }
}

CacaoContextPad.$inject = [
  'modeling',
  'elementFactory',
  'create',
  'contextPad',
  'cacaoAutoPlace',
  'cacaoRules',
  'cacaoConnect',
  'eventBus',
  'playbookHandler',
  'selection',
  'cacaoSidePanel',
];
