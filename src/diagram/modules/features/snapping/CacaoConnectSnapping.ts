import { mid } from 'diagram-js/lib/features/snapping/SnapUtil';
import { isCmd } from 'diagram-js/lib/features/keyboard/KeyboardUtil';
import EventBus from 'diagram-js/lib/core/EventBus';
import { Shape } from 'diagram-js/lib/model/Types';
import { CacaoConnectionType } from '../../../elements/connections/CacaoBaseConnection';

var HIGHER_PRIORITY = 1250;

/**
 * This class is a module
 * - module's entry points:
 *    - drawConnection(..) & drawShape(...)
 * - goal:
 *    - it render all the cacao constructs and cacao connection
 */
export default class CacaoConnectSnapping {
  private _eventBus: EventBus;
  static $inject: string[];

  constructor(eventBus: EventBus) {
    this._eventBus = eventBus;
    this.bindEvents();
  }

  /**
   * this method bind all the events:
   *  - this event snap any connection to the center of the connected shapes
   */
  private bindEvents() {
    this._eventBus.on(
      ['cacaoConnect.hover', 'cacaoConnect.move', 'cacaoConnect.end'],
      HIGHER_PRIORITY,
      function (event: any) {
        let context: any = event.context;
        let canExecute: boolean | CacaoConnectionType = context.canExecute;
        let start: Shape = context.start;
        let target: any = context.target;

        // Do NOT snap on CMD
        if (event.originalEvent && isCmd(event.originalEvent)) {
          return;
        }

        // Snap connection end
        if (canExecute && target) {
          let midTarget = mid(target, null);
          event.x = midTarget.x;
          event.y = midTarget.y;
        }

        // Snap connection start
        if (canExecute && start && context.connectionStart) {
          let midStart = mid(start, null);
          context.connectionStart.x = midStart.x;
          context.connectionStart.y = midStart.y;
        }
      },
    );
  }
}

CacaoConnectSnapping.$inject = ['eventBus'];
