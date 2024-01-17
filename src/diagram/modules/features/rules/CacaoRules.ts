import RuleProvider, {
  EventBus,
} from 'diagram-js/lib/features/rules/RuleProvider';
import { CacaoConnectionType } from '../../../elements/connections/CacaoBaseConnection';
import CacaoUtils from '../../core/CacaoUtils';
import { Element } from 'diagram-js/lib/model/Types';
import CacaoFactory from '../../factory/CacaoFactory';
import CacaoBaseConstruct, {
  CacaoConstructType,
} from '../../../elements/constructs/CacaoBaseConstruct';
import PlaybookHandler from '../../model/PlaybookHandler';

/**
 * This class is a module
 * - module's entry points:
 *    - canConnectStart(...) & canConnect(...)
 *    - rules.allowed(...)
 * - goal:
 *    - it defines the designing rules
 */
export default class CacaoRules extends RuleProvider {
  private _playbookHandler: PlaybookHandler;

  constructor(eventBus: EventBus, playbookHandler: PlaybookHandler) {
    super(eventBus);
    this._playbookHandler = playbookHandler;
  }

  /**
   * initialize all the cacao rules
   */
  override init() {
    let self = this;

    //to know if we can start a connection from this source
    //when we click on a shape to init a connection from it
    this.addRule('connection.start', function (context) {
      return self.canStartConnect(context.source, context.type);
    });

    //to know if we can end a connection on this target
    //when we hover (or release click) on an element (shape or root or connection)
    this.addRule('connection.create', function (context) {
      let retour = self.canConnect(
        context.source,
        context.target,
        context.type,
      );
      return retour;
    });

    this.addRule('connection.reconnect', function (context) {
      return false;
    });

    this.addRule('connection.updateWaypoints', function (context) {
      return false;
    });

    this.addRule('shape.attach', function (context) {
      return false;
    });

    this.addRule('shape.resize', function (context) {
      return self.canResize(context.shape);
    });
  }

  /**
   * This is a method to know if we can resize the provided element
   * @param element
   * @returns True if we can resize the provided element
   */
  canResize(element: Element): boolean {
    let cacaoConstruct = CacaoFactory.getCacaoConstruct(element);
    if (cacaoConstruct) {
      return cacaoConstruct.properties.resizable;
    }
    return false;
  }

  /**
   * This is a method to know if we can start a connection from the provided source of the provided type
   * @param source
   * @param connectionType
   * @returns True if we can start the connection from the source, False otherwise
   */
  canStartConnect(
    source: Element,
    connectionType: CacaoConnectionType,
  ): boolean {
    let cacaoSource = CacaoFactory.getCacaoConstruct(source);

    // If undefined or not a cacaoConstruct
    if (!cacaoSource || !connectionType) {
      return false;
    }

    // If the cacao construct does not accept outgoing connection of that type
    if (!this.acceptOutgoingConnection(cacaoSource, connectionType)) {
      return false;
    }

    return true;
  }

  /**
   *
   * Prevents creating a Start Step when one already exists.
   */
  canCreate(type: CacaoConstructType): boolean {
    if (type == CacaoConstructType.START_STEP) {
      let id = this._playbookHandler.playbook.workflow_start;
      return id == '' || id == undefined;
    }
    return true;
  }

  /**
   * This is a method to know if we can connect these two shapes with a connection of that type
   * @param source
   * @param target
   * @param connectionType
   * @returns True if we can make the connection, False otherwise
   */
  canConnect(
    source: Element,
    target: Element,
    connectionType: CacaoConnectionType,
  ): CacaoConnectionType | boolean {
    let cacaoSource = CacaoFactory.getCacaoConstruct(source);
    let cacaoTarget = CacaoFactory.getCacaoConstruct(target);

    // If one of the two shapes is not defined or not a cacaoConstruct
    // If connectionType undefined
    if (!cacaoSource || !cacaoTarget || !connectionType) {
      return false;
    }

    // If the two shapes are already connected, we can add another connection
    if (this.areShapesAlreadyConnected(source, target)) {
      return false;
    }

    // If the source can start a connection of that type
    if (!this.canStartConnect(source, connectionType)) {
      return false;
    }

    // If the target does not accept incoming connections from this type
    if (!this.acceptIncomingConnection(cacaoTarget, connectionType)) {
      return false;
    }

    return true;
  }

  /**
   * Gets the first type of connection allowed for the provided source element and the target type.
   * @param source
   * @param targetType
   * @returns the first type of connection allowed for the provided parameters. Return undefined if we can not do any connection
   */
  canConnectToShapeType(
    source: Element,
    targetType: CacaoConstructType,
  ): CacaoConnectionType | undefined {
    for (let connectionType of Object.values(CacaoConnectionType)) {
      if (
        this.canConnect(source, { type: targetType } as any, connectionType)
      ) {
        return connectionType;
      }
    }
    return undefined;
  }

  /**
   * Checking if we can change the type of an existing connection
   * @param source
   * @param target
   * @param oldType
   * @param newType
   * @returns True if we can change the connection type, False otherwise
   */
  canChangeConnectionType(
    source: Element,
    target: Element,
    oldType: CacaoConnectionType,
    newType: CacaoConnectionType,
  ): boolean {
    let cacaoSource = CacaoFactory.getCacaoConstruct(source);
    let cacaoTarget = CacaoFactory.getCacaoConstruct(target);

    // If one of the two shapes is not defined or not a cacaoConstruct
    // If newType undefined
    if (!cacaoSource || !cacaoTarget || !newType) {
      return false;
    }

    // We can not change to the same type
    if (oldType == newType) {
      return false;
    }

    // If the target does not accept incoming connections of this type
    if (!this.acceptIncomingConnection(cacaoTarget, newType, [oldType])) {
      return false;
    }

    // If the source does not accept outgoing connections of this type
    if (!this.acceptOutgoingConnection(cacaoSource, newType, [oldType])) {
      return false;
    }

    return true;
  }

  /**
   * Checks if two shapes are already connected or not
   * @param source the shape where the connection begins
   * @param target the shapes where the connection ends
   * @returns True if the shapes are already connected or the same shape, False otherwise. Return False if one of the shapes is not a CacaoConstruct or just undefined
   */
  private areShapesAlreadyConnected(source: Element, target: Element): boolean {
    let cacaoSource = CacaoFactory.getCacaoConstruct(source);
    let cacaoTarget = CacaoFactory.getCacaoConstruct(target);

    // If source/target is undefined/not a cacao construct
    if (!cacaoSource || !cacaoTarget) {
      return false;
    }

    // If the source and the target is the same shape
    if (cacaoSource.equals(cacaoTarget)) {
      return true;
    }

    let cacaoConnectionList = cacaoSource.outgoingConnections;

    // If the cacao constructs does not have outgoing connections property
    if (!cacaoConnectionList) {
      return false;
    }

    // Test if any connection's target is the same than the target passed in parameter
    for (let cacaoConnection of cacaoConnectionList) {
      if (cacaoConnection.target && cacaoConnection.target === target) {
        return true;
      }
    }

    return false;
  }

  /**
   * Checks if the source(workflow step) accepts a new outgoing connection of provided type
   * @param cacaoSource
   * @param type
   * @param ignoredTypes
   * @returns
   */
  private acceptOutgoingConnection(
    cacaoSource: CacaoBaseConstruct,
    type: CacaoConnectionType,
    ignoredTypes: CacaoConnectionType[] = [],
  ): boolean {
    // If the cacao construct does not accept outgoing connection of that type
    if (!cacaoSource.properties.outgoingConnectionAllowed.includes(type)) {
      return false;
    }

    // If not attach to an element on the canvas
    if (!cacaoSource.shape) {
      return false;
    }

    // Checking if the provided connection type can be created, given the already existing connections.
    if (cacaoSource.outgoingConnections) {
      for (let connection of cacaoSource.outgoingConnections) {
        let cacaoConnection = CacaoFactory.getCacaoConnection(connection);
        if (!cacaoConnection || ignoredTypes.includes(cacaoConnection.type)) {
          continue;
        }
        if (
          !cacaoConnection.properties.neighborConnectionAllowed.includes(type)
        ) {
          return false;
        }
      }
    }

    // Test if the condition connection can be created depending on the already created connections
    if (
      cacaoSource.type === CacaoConstructType.IF_CONDITION_STEP &&
      CacaoUtils.isAny(type, [
        CacaoConnectionType.ON_IF_FALSE_CONDITION,
        CacaoConnectionType.ON_IF_TRUE_CONDITION,
      ])
    ) {
      let exist = false;
      cacaoSource?.outgoingConnections?.forEach(connection => {
        if (connection.type === type) exist = true;
      });
      if (exist) {
        return false;
      }
    }

    if (
      cacaoSource.type === CacaoConstructType.SWITCH_CONDITION_STEP &&
      type === CacaoConnectionType.ON_SWITCH_CONDITION
    ) {
      return true;
    }

    if (
      cacaoSource.type === CacaoConstructType.WHILE_CONDITION_STEP &&
      type === CacaoConnectionType.ON_WHILE_CONDITION
    ) {
      let countWhileConnection = 0;
      cacaoSource?.outgoingConnections?.forEach(connection => {
        if (connection.type === CacaoConnectionType.ON_WHILE_CONDITION)
          countWhileConnection++;
      });
      if (countWhileConnection == 1) {
        return false;
      }
    }

    return true;
  }

  /**
   * Checks if the target accept a new incoming connection of that type
   * @param cacaoTarget
   * @param type
   * @param ignoredTypes
   * @returns
   */
  private acceptIncomingConnection(
    cacaoTarget: CacaoBaseConstruct,
    type: CacaoConnectionType,
    ignoredTypes: CacaoConnectionType[] = [],
  ): boolean {
    // If the cacao construct does not accept outgoing connection of that type
    if (!cacaoTarget.properties.incomingConnectionAllowed.includes(type)) {
      return false;
    }

    return true;
  }
}

CacaoRules.$inject = ['eventBus', 'playbookHandler'];
