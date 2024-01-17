import CommandStack from 'diagram-js/lib/command/CommandStack';
import ElementFactory from 'diagram-js/lib/core/ElementFactory';
import EventBus from 'diagram-js/lib/core/EventBus';
import BaseModeling, {
  CommandHandlerConstructor,
  ModelingCreateShapeHints,
  ModelingHints,
} from 'diagram-js/lib/features/modeling/Modeling';
import { Connection, Element, Parent, Shape } from 'diagram-js/lib/model/Types';
import Rules from 'diagram-js/lib/features/rules/Rules';
import { Point } from 'diagram-js/lib/util/Types';
import CacaoBaseConnection, {
  CacaoConnectionType,
} from '../../../elements/connections/CacaoBaseConnection';
import PlaybookHandler, {
  ContextPlaybookAttrs,
} from '../../model/PlaybookHandler';
import CacaoBaseConstruct, {
  CacaoConstructType,
} from '../../../elements/constructs/CacaoBaseConstruct';
import CacaoFactory from '../../factory/CacaoFactory';
import CacaoLayouter from './CacaoLayouter';
import Canvas from 'diagram-js/lib/core/Canvas';
import { assign } from 'min-dash';

import AppendShapeHandler from 'diagram-js/lib/features/modeling/cmd/AppendShapeHandler';
import CreateConnectionHandler from 'diagram-js/lib/features/modeling/cmd/CreateConnectionHandler';
import CreateShapeHandler from 'diagram-js/lib/features/modeling/cmd/CreateShapeHandler';
import DeleteConnectionHandler from 'diagram-js/lib/features/modeling/cmd/DeleteConnectionHandler';
import DeleteShapeHandler from 'diagram-js/lib/features/modeling/cmd/DeleteShapeHandler';
import LayoutConnectionHandler from 'diagram-js/lib/features/modeling/cmd/LayoutConnectionHandler';
import MoveConnectionHandler from 'diagram-js/lib/features/modeling/cmd/MoveConnectionHandler';
import MoveShapeHandler from 'diagram-js/lib/features/modeling/cmd/MoveShapeHandler';
import UpdateWaypointsHandler from 'diagram-js/lib/features/modeling/cmd/UpdateWaypointsHandler';
import CreateElementsHandler from 'diagram-js/lib/features/modeling/cmd/CreateElementsHandler';
import DeleteElementsHandler from 'diagram-js/lib/features/modeling/cmd/DeleteElementsHandler';
import MoveElementsHandler from 'diagram-js/lib/features/modeling/cmd/MoveElementsHandler';
import UpdateShapeHandler from './handlers/UpdateShapeHandler';
import UpdateConnectionTypeHandler from './handlers/UpdateConnectionTypeHandler';
import SpaceToolHandler from 'diagram-js/lib/features/modeling/cmd/SpaceToolHandler';
import ToggleShapeCollapseHandler from 'diagram-js/lib/features/modeling/cmd/ToggleShapeCollapseHandler';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import CacaoUtils from '../../core/CacaoUtils';
import GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory';

/**
 * This class is a module
 * - module's entry points:
 *    - connect(...) & appendShape(...) & updateType(...)
 * - goal:
 *    - override behavior of Modeling (diagram-js)
 */
export default class CacaoModeling extends BaseModeling {
  private _rules: Rules;
  private _commandStack: CommandStack;
  private _elementFactory: ElementFactory;
  private _elementRegistry: ElementRegistry;
  private _playbookHandler: PlaybookHandler;
  private _eventBus: EventBus;
  private _cacaoLayouter: CacaoLayouter;
  private _canvas: Canvas;
  private _graphicsFactory: GraphicsFactory;

  constructor(
    layouter: CacaoLayouter,
    eventBus: EventBus,
    elementFactory: ElementFactory,
    elementRegsitry: ElementRegistry,
    commandStack: CommandStack,
    rules: Rules,
    playbookHandler: PlaybookHandler,
    canvas: Canvas,
    graphicsFactory: GraphicsFactory,
  ) {
    super(eventBus, elementFactory, commandStack);
    this._rules = rules;
    this._commandStack = commandStack;
    this._elementFactory = elementFactory;
    this._elementRegistry = elementRegsitry;
    this._playbookHandler = playbookHandler;
    this._eventBus = eventBus;
    this._cacaoLayouter = layouter;
    this._canvas = canvas;
    this._graphicsFactory = graphicsFactory;
  }

  /**
   * this method overrides the handlers' list of the default Modeling class to add custom handlers
   * @returns the handlers' list
   */
  override getHandlers(): Map<string, CommandHandlerConstructor> {
    return {
      'shape.append': AppendShapeHandler,
      'shape.create': CreateShapeHandler,
      'shape.delete': DeleteShapeHandler,
      'shape.move': MoveShapeHandler,
      'shape.update': UpdateShapeHandler,
      'shape.toggleCollapse': ToggleShapeCollapseHandler,

      spaceTool: SpaceToolHandler,

      'connection.create': CreateConnectionHandler,
      'connection.delete': DeleteConnectionHandler,
      'connection.move': MoveConnectionHandler,
      'connection.layout': LayoutConnectionHandler,
      'connection.updateWaypoints': UpdateWaypointsHandler,
      'connection.update': UpdateConnectionTypeHandler,

      'elements.create': CreateElementsHandler,
      'elements.move': MoveElementsHandler,
      'elements.delete': DeleteElementsHandler,
    } as any;
  }

  clearCanvas() {
    this._commandStack.clear;
    this._eventBus.fire('diagram.clear');
  }

  newCanvas() {
    this._commandStack.clear;
    this._eventBus.fire('diagram.clear');
    this._eventBus.fire('load.workflow', {
      playbook: this._playbookHandler.playbook,
    });
  }

  /**
   * say if the view is in expanded mode or in collapsed mode
   * @returns a boolean, True if in expanded mode, False otherwise
   */
  isExpandedMode(): boolean {
    for (let element of this._elementRegistry.getAll()) {
      if (CacaoUtils.isConstructType(element?.type)) {
        return !element.collapsed;
      }
    }
    return false;
  }

  /**
   * create a new shape and connect it to the source shape
   * @param source
   * @param shape the new shape
   * @param position the position of the new shape
   * @param target the parent of the new shape (MUST be root in our case)
   * @param hints
   * @returns the new created shape
   */
  appendShape(
    source: Element,
    shape: Partial<Shape>,
    position: Point,
    target: Parent,
    connection: Partial<Connection>,
  ): any {
    shape = this.createShape(shape, position, target, 0, connection);

    var context = {
      source: source,
      position: position,
      target: target,
      shape: shape,
      connection: {
        type: connection.type,
        modelAssociated: connection.modelAssociated,
        waypoints: connection.waypoints ?? [],
      },
      connectionParent: connection.connectionParent,
    };

    //add connection if possible
    if (
      connection.type &&
      this._rules.allowed('connection.create', {
        source: source,
        target: shape,
        type: connection.type,
      })
    ) {
      this.connect(source, shape as Shape, connection);
    }
    return context.shape;
  }

  /**
   * remove the shape from the canvas and the playbook (model)
   * @param shape
   * @param hints
   */
  override removeShape(shape: Shape, hints: any) {
    super.removeShape(shape, hints);
    if (shape.modelAssociated) {
      this._playbookHandler.removeStep(shape.id);
    }
    let context: ContextPlaybookAttrs = {
      action: 'remove.shape',
      element: shape,
    };
    this._eventBus.fire('playbook.changed', context);
    if (shape.type == CacaoConstructType.START_STEP) {
      this._eventBus.fire('palette.update', {});
    }
  }

  /**
   * create a shape on the canva and in the playbook (model)
   * @param shape
   * @param position
   * @param target
   * @param parentIndex
   * @param hints
   * @returns
   */
  override createShape(
    shape: Partial<Shape>,
    position: Point,
    target: Parent,
    parentIndex: any,
    hints?: ModelingCreateShapeHints | undefined,
  ): Shape {
    let cacaoConstruct: CacaoBaseConstruct | undefined;

    cacaoConstruct = CacaoFactory.getCacaoConstruct(shape as Shape);

    if (!cacaoConstruct || !shape.id) {
      throw new Error('shape MUST have : type, id');
    }

    if (!shape.modelAssociated) {
      this._playbookHandler.createStep(
        cacaoConstruct.properties.modelType,
        shape.id,
      );
      shape.modelAssociated = true;
    }

    shape = this.create('shape', shape);
    assign(shape, {
      x: position.x,
      y: position.y,
      collapsed: !this.isExpandedMode(),
    });

    this._canvas.addShape(shape as Shape, target, parentIndex);
    this._canvas.scrollToElement(shape as Shape, {
      top: 0,
      right: 500,
      bottom: 0,
      left: 0,
    });
    let context: ContextPlaybookAttrs = {
      action: 'add.shape',
      element: shape as Shape,
    };

    this._eventBus.fire('playbook.changed', context);
    if (shape.type == CacaoConstructType.START_STEP) {
      this._eventBus.fire('palette.update', {});
    }
    return shape as Shape;
  }

  updateShape(shape: Shape) {
    this.updateGraphicalShapeOnCanvas(shape);
    let contextEvent: ContextPlaybookAttrs = {
      action: 'update.shape',
      element: shape,
    };
    this._eventBus.fire('playbook.changed', contextEvent);
  }

  updateGraphicalShapeOnCanvas(shape: Shape) {
    this._graphicsFactory.update(
      'shape',
      shape,
      this._elementRegistry.getGraphics(shape),
    );
  }

  /**
   * connect the source to the target with the type provided in the dictionnary attrs
   * @param source
   * @param target
   * @param attrs a dictionnary of attributs, MUST contains the key 'type'
   * @param hints
   * @returns the created connection
   */
  override connect(
    source: Element,
    target: Element,
    attrs?: any,
    hints?: ModelingHints | undefined,
  ): Connection {
    if (!attrs || !attrs.type) {
      throw new Error(
        "can't connect the two shapes because there is no type for the connection provided",
      );
    }
    return this.createConnection(
      source,
      target,
      0,
      attrs || {},
      source.parent as Parent,
      hints,
    );
  }

  /**
   * create a connection on the canvas and in the playbook (model)
   * @param source
   * @param target
   * @param parentIndex
   * @param connection
   * @param parent
   * @param hints
   * @returns
   */
  override createConnection(
    source: Element,
    target: Element,
    parentIndex: any,
    connection: Partial<Connection>,
    parent: Parent,
    hints?: ModelingHints | undefined,
  ): Connection {
    let cacaoConnection: CacaoBaseConnection | undefined;
    if (typeof parentIndex === 'object') {
      hints = parent;
      parent = connection as any;
      connection = parentIndex;
      parentIndex = undefined;
    }

    cacaoConnection = CacaoFactory.getCacaoConnection(connection as Connection);

    if (!cacaoConnection) {
      throw new Error('connection MUST have : type');
    }

    if (!connection.modelAssociated) {
      this._playbookHandler.connectSteps(source.id, target.id, connection.type);
      connection.modelAssociated = true;
    }

    connection = this.create('connection', connection as Connection);
    connection.source = source;
    connection.target = target;

    connection.waypoints = this._cacaoLayouter.layoutConnection(
      connection as Connection,
      hints,
    );
    this._canvas.addConnection(connection as Connection, parent, parentIndex);
    let context: ContextPlaybookAttrs = {
      action: 'add.connection',
      element: connection as Connection,
    };
    this._eventBus.fire('playbook.changed', context);
    return connection as Connection;
  }

  /**
   * remove a connection from the canvas and from the playbook (model)
   * @param connection
   * @param hints
   */
  override removeConnection(
    connection: Connection,
    hints?: ModelingHints | undefined,
  ): void {
    if (
      connection?.source?.modelAssociated &&
      connection?.target?.modelAssociated
    ) {
      this._playbookHandler.disconnectSteps(
        connection.source.id,
        connection.target.id,
        connection.type,
      );
    }
    super.removeConnection(connection, hints);

    let context: ContextPlaybookAttrs = {
      action: 'remove.connection',
      element: connection,
    };
    this._eventBus.fire('playbook.changed', context);
  }

  /**
   * update the type of the connection
   * @param connection
   * @param type
   */
  updateConnectionType(connection: Connection, type: CacaoConnectionType) {
    if (!connection || !connection.type) {
      throw new Error(
        'connection parameter must be defined, same for connection.type',
      );
    }

    if (!connection.source || !connection.source.modelAssociated) {
      throw new Error('connection.source and its modelElement must be defined');
    }

    if (!connection.target || !connection.target.modelAssociated) {
      throw new Error('connection.target and its modelElement must be defined');
    }

    this._commandStack.execute('connection.update', {
      connection: connection,
      type: type,
    });
    let context: ContextPlaybookAttrs = {
      action: 'update.connection',
      element: connection,
    };
    this._eventBus.fire('playbook.changed', context);
  }

  /**
   * create a shape of the type with the attributs using the elementFactory
   * @param type
   * @param attrs
   * @returns the created shape
   */
  private create(type: any, attrs: any) {
    return this._elementFactory.create(type, attrs);
  }
}

CacaoModeling.$inject = [
  'layouter',
  'eventBus',
  'elementFactory',
  'elementRegistry',
  'commandStack',
  'rules',
  'playbookHandler',
  'canvas',
  'graphicsFactory',
];
