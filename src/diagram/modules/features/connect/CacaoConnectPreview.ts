import { Injector } from 'diagram-js/lib/command/CommandStack';
import Canvas from 'diagram-js/lib/core/Canvas';
import EventBus from 'diagram-js/lib/core/EventBus';

var HIGH_PRIORITY = 1100,
  LOW_PRIORITY = 900;

var MARKER_OK = 'connect-ok',
  MARKER_NOT_OK = 'connect-not-ok';

export default class ConnectPreview {
  _injector: Injector;
  _eventBus: EventBus;
  _canvas: Canvas;

  static $inject: string[];

  constructor(injector: Injector, eventBus: EventBus, canvas: Canvas) {
    this._injector = injector;
    this._eventBus = eventBus;
    this._canvas = canvas;
    this.bindEvents();
  }

  bindEvents() {
    let connectionPreview: any = this._injector.get('connectionPreview', false);
    let canvas = this._canvas;

    this._eventBus.on(
      'cacaoConnect.hover',
      LOW_PRIORITY,
      function (event: any) {
        var context = event.context,
          hover = event.hover,
          canExecute = context.canExecute;

        // Ignore hover
        if (canExecute === null) {
          return;
        }

        canvas.addMarker(hover, canExecute ? MARKER_OK : MARKER_NOT_OK);
      },
    );

    this._eventBus.on(
      ['cacaoConnect.out', 'cacaoConnect.cleanup'],
      HIGH_PRIORITY,
      function (event: any) {
        var hover = event.hover;

        if (hover) {
          canvas.removeMarker(hover, MARKER_OK);
          canvas.removeMarker(hover, MARKER_NOT_OK);
        }
      },
    );

    if (!connectionPreview) {
      return;
    }

    this._eventBus.on('cacaoConnect.move', function (event: any) {
      var context = event.context,
        canConnect = context.canExecute,
        hover = context.hover,
        source = context.source,
        start = context.start,
        startPosition = context.startPosition,
        target = context.target,
        connectionStart = context.connectionStart || startPosition,
        connectionEnd = context.connectionEnd || {
          x: event.x,
          y: event.y,
        },
        previewStart = connectionStart,
        previewEnd = connectionEnd;

      connectionPreview.drawPreview(context, canConnect, {
        source: source || start,
        target: target || hover,
        connectionStart: previewStart,
        connectionEnd: previewEnd,
      });
    });

    this._eventBus.on('cacaoConnect.cleanup', function (event: any) {
      connectionPreview.cleanUp(event.context);
    });
  }
}

ConnectPreview.$inject = ['injector', 'eventBus', 'canvas'];
