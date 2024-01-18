import {
  Connection,
  ConnectionLike,
  Element,
} from 'diagram-js/lib/model/Types';
import { KeyValue } from 'tiny-svg';
import CacaoBaseConnection, {
  CacaoConnectionType,
} from '../CacaoBaseConnection';
import Canvas from 'diagram-js/lib/core/Canvas';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import CacaoUtils from '../../../modules/core/CacaoUtils';

export default class CacaoOnFailureConnection extends CacaoBaseConnection {
  constructor(connection: Connection | ConnectionLike | Element | undefined) {
    super(
      connection,
      CacaoConnectionType.ON_FAILURE,
      {
        attachers: 'b:l',
        className: 'on-failure',
        neighborConnectionAllowed: Object.values(CacaoConnectionType).filter(
          type =>
            !CacaoUtils.isAny(type, [
              CacaoConnectionType.ON_COMPLETION,
              CacaoConnectionType.ON_FAILURE,
            ]),
        ),
      },
      { stroke: '#7D0001' },
    );
  }

  override drawConnection(
    playbookHandler: PlaybookHandler,
    canvas: Canvas,
    visuals: SVGElement,
    connection: Connection,
  ): SVGElement {
    let attrs: KeyValue;
    let elmt: SVGElement;

    attrs = this.getDrawingAttributs(canvas);
    elmt = this.drawLineConnection(visuals, connection, attrs);
    this.drawEmbeddedLabel(
      visuals,
      connection,
      connection != undefined && connection.source != undefined
        ? 'on failure'
        : '',
    );
    return elmt;
  }
}
