import CroppingConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import EventBus from 'diagram-js/lib/core/EventBus';
import { ConnectionLike } from 'diagram-js/lib/model/Types';

/**
 * This class is a module
 * - module's entry points:
 *    - cropConnection(..) triggered on actions => ('connection.layout','connection.create')
 * - goal:
 *    -
 */
export default class CacaoUpdater extends CommandInterceptor {
  _eventBus: EventBus;
  _connectionDocking: CroppingConnectionDocking;

  constructor(
    eventBus: EventBus,
    connectionDocking: CroppingConnectionDocking,
  ) {
    super(eventBus);
    this._eventBus = eventBus;
    this._connectionDocking = connectionDocking;
    var self = this;
    this.executed(
      ['connection.layout', 'connection.create'],
      function (e: any) {
        self.cropConnection(e);
      },
    );
  }

  /**
   * this is a method to crop the connection
   * this method updates the docking points and put them along the border of the shape.
   * @param e the event
   */
  cropConnection(e: any) {
    let context: any = e.context;
    let hints: any = context.hints || {};
    let connection: ConnectionLike;

    if (!context.cropped && hints.createElementsBehavior !== false) {
      connection = context.connection;
      connection.waypoints = this._connectionDocking.getCroppedWaypoints(
        connection,
        connection.source,
        connection.target,
      );
      context.cropped = true;
    }
  }
}

CacaoUpdater.$inject = ['eventBus', 'connectionDocking'];
