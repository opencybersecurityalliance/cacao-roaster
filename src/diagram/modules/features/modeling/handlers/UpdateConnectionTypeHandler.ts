import { CommandHandler } from 'diagram-js/lib/command/CommandStack';
import CacaoUtils from '../../../core/CacaoUtils';
import { Connection, ElementLike } from 'diagram-js/lib/model/Types';
import PlaybookHandler from 'src/diagram/modules/model/PlaybookHandler';

/**
 * This class is a modeling handler
 * This class handle the change of the connection's type
 */
export default class UpdateConnectionTypeHandler implements CommandHandler {
  static $inject: string[];
  private _playbookHandler: PlaybookHandler;

  constructor(playbookHandler: PlaybookHandler) {
    this._playbookHandler = playbookHandler;
  }

  /**
   * This method execute the changement of the connection's type
   * @param context
   * @returns the modified elements
   */
  execute(context: any): ElementLike[] {
    let connection = context.connection;
    let newType = context.type;
    let oldType = CacaoUtils.getTypeOfElement(connection);

    if (!connection || !newType || !oldType) {
      throw new Error('element, type and newType required in the context');
    }

    // Not a cacao connection -> ignore action
    if (!CacaoUtils.isConnectionType(oldType)) {
      throw new Error('element is not a cacao connection element');
    }

    // Store old values
    context.oldType = oldType;

    // Update properties
    connection.type = newType;

    return [connection];
  }

  postExecute(context: any) {
    this._playbookHandler.updateConnection(
      context.connection.source.id,
      context.connection.target.id,
      context.oldType,
      context.type,
    );
  }

  revert(context: any) {
    let connection = context.connection;
    let oldType = context.oldType;

    connection.type = oldType;

    return [connection];
  }
}

UpdateConnectionTypeHandler.$inject = ['playbookHandler'];
