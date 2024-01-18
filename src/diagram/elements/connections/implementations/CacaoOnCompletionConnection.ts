import {
  Connection,
  ConnectionLike,
  Element,
} from 'diagram-js/lib/model/Types';
import { KeyValue } from 'tiny-svg';
import Canvas from 'diagram-js/lib/core/Canvas';
import CacaoBaseConnection, {
  CacaoConnectionType,
} from '../CacaoBaseConnection';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import CacaoUtils from '../../../modules/core/CacaoUtils';
import { CacaoConstructType } from '../../constructs/CacaoBaseConstruct';

export default class CacaoOnCompletionConnection extends CacaoBaseConnection {
  constructor(connection: Connection | ConnectionLike | Element | undefined) {
    super(
      connection,
      CacaoConnectionType.ON_COMPLETION,
      {
        attachers: 'r:l',
        className: 'on-completion',
        neighborConnectionAllowed: Object.values(CacaoConnectionType).filter(
          type =>
            !CacaoUtils.isAny(type, [
              CacaoConnectionType.ON_SUCCESS,
              CacaoConnectionType.ON_FAILURE,
              CacaoConnectionType.ON_COMPLETION,
            ]),
        ),
      },
      { stroke: 'black' },
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

    let name =
      connection != undefined && connection.source != undefined
        ? 'on completion'
        : '';

    if (connection?.source?.type === CacaoConstructType.START_STEP) {
      name = '';
    }

    attrs = this.getDrawingAttributs(canvas);
    elmt = this.drawLineConnection(visuals, connection, attrs);
    this.drawEmbeddedLabel(visuals, connection, name);
    return elmt;
  }
}
