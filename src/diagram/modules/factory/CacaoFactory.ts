import CacaoBaseConnection, {
  CacaoConnectionType,
} from '../../elements/connections/CacaoBaseConnection';
import CacaoBaseConstruct, {
  CacaoConstructType,
} from '../../elements/constructs/CacaoBaseConstruct';
import CacaoActionConstruct from '../../elements/constructs/implementations/CacaoActionConstruct';
import CacaoEndConstruct from '../../elements/constructs/implementations/CacaoEndConstruct';
import CacaoStartConstruct from '../../elements/constructs/implementations/CacaoStartConstruct';
import CacaoSwitchConditionConstruct from '../../elements/constructs/implementations/CacaoSwitchConditionConstruct';
import CacaoUtils from '../core/CacaoUtils';
import {
  Shape,
  ShapeLike,
  Element,
  Connection,
  ConnectionLike,
} from 'diagram-js/lib/model/Types';
import CacaoOnCompletionConnection from '../../elements/connections/implementations/CacaoOnCompletionConnection';
import CacaoOnSuccessConnection from '../../elements/connections/implementations/CacaoOnSuccessConnection';
import CacaoOnFailureConnection from '../../elements/connections/implementations/CacaoOnFailureConnection';
import CacaoWhileConditionConstruct from '../../elements/constructs/implementations/CacaoWhileConditionConstruct';
import CacaoPlaybookActionConstruct from '../../elements/constructs/implementations/CacaoPlaybookActionConstruct';
import CacaoParallelConstruct from '../../elements/constructs/implementations/CacaoParallelConstruct';
import CacaoIfConditionConstruct from '../../elements/constructs/implementations/CacaoIfConditionConstruct';
import CacaoOnWhileConditionConnection from '../../elements/connections/implementations/CacaoOnWhileConditionConnection';
import CacaoOnSwitchConditionConnection from '../../elements/connections/implementations/CacaoOnSwitchConditionConnection';
import CacaoOnParallelConnection from '../../elements/connections/implementations/CacaoOnParallelConnection';
import CacaoOnIfFalseConditionConnection from '../../elements/connections/implementations/CacaoOnIfFalseConditionConnection';
import CacaoOnIfTrueConditionConnection from '../../elements/connections/implementations/CacaoOnIfTrueConditionConnection';

/**
 * This class provide static methods to get cacao element using the type/shape/connection
 */
export default abstract class CacaoFactory {
  /**
   * this method instanciate a CacaoConstruct depending its type/Shape
   * @param shape
   * @param type
   * @returns a CacaoConstruct
   */
  static getCacaoConstruct(
    shape: Shape | ShapeLike | Element | undefined,
    type: CacaoConstructType | undefined = undefined,
  ): CacaoBaseConstruct | undefined {
    if (!type && shape) {
      type = CacaoUtils.getTypeOfElement(shape) as any;
    }

    switch (type) {
      case CacaoConstructType.START_STEP:
        return new CacaoStartConstruct(shape);
      case CacaoConstructType.END_STEP:
        return new CacaoEndConstruct(shape);
      case CacaoConstructType.ACTION_STEP:
        return new CacaoActionConstruct(shape);
      case CacaoConstructType.PLAYBOOK_ACTION_STEP:
        return new CacaoPlaybookActionConstruct(shape);
      case CacaoConstructType.PARALLEL_STEP:
        return new CacaoParallelConstruct(shape);
      case CacaoConstructType.SWITCH_CONDITION_STEP:
        return new CacaoSwitchConditionConstruct(shape);
      case CacaoConstructType.WHILE_CONDITION_STEP:
        return new CacaoWhileConditionConstruct(shape);
      case CacaoConstructType.IF_CONDITION_STEP:
        return new CacaoIfConditionConstruct(shape);
      default:
        return undefined;
    }
  }

  /**
   * this method instanciate a list CacaoConnection depending their Connection element
   * @param connectionList
   * @returns a list of CacaoConnection
   */
  static getCacaoConnectionList(
    connectionList: (Connection | ConnectionLike | Element | undefined)[],
  ): CacaoBaseConnection[] {
    let list: CacaoBaseConnection[] = [];
    for (let connection of connectionList) {
      let cacaoConnection = CacaoFactory.getCacaoConnection(connection);
      if (cacaoConnection) {
        list.push(cacaoConnection);
      }
    }
    return list;
  }

  /**
   * this method instanciate a CacaoConnection depending its type/Connection element
   * @param shape
   * @param type
   * @returns a CacaoConnection
   */
  static getCacaoConnection(
    connection: Connection | ConnectionLike | Element | undefined,
    type: CacaoConnectionType | undefined = undefined,
  ): CacaoBaseConnection | undefined {
    if (!type) {
      type = CacaoUtils.getTypeOfElement(connection) as any;
    }

    switch (type) {
      case CacaoConnectionType.ON_COMPLETION:
        return new CacaoOnCompletionConnection(connection);
      case CacaoConnectionType.ON_SUCCESS:
        return new CacaoOnSuccessConnection(connection);
      case CacaoConnectionType.ON_FAILURE:
        return new CacaoOnFailureConnection(connection);
      case CacaoConnectionType.ON_PARALLEL:
        return new CacaoOnParallelConnection(connection);
      case CacaoConnectionType.ON_SWITCH_CONDITION:
        return new CacaoOnSwitchConditionConnection(connection);
      case CacaoConnectionType.ON_WHILE_CONDITION:
        return new CacaoOnWhileConditionConnection(connection);
      case CacaoConnectionType.ON_IF_FALSE_CONDITION:
        return new CacaoOnIfFalseConditionConnection(connection);
      case CacaoConnectionType.ON_IF_TRUE_CONDITION:
        return new CacaoOnIfTrueConditionConnection(connection);
      default:
        return undefined;
    }
  }
}
