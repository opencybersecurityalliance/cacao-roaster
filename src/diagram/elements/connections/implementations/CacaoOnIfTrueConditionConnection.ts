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

export default class CacaoOnIfTrueConditionConnection extends CacaoBaseConnection {
  constructor(connection: Connection | ConnectionLike | Element | undefined) {
    super(
      connection,
      CacaoConnectionType.ON_IF_TRUE_CONDITION,
      {
        attachers: 'b:l',
        className: 'on-true-condition',
        neighborConnectionAllowed: Object.values(CacaoConnectionType),
      },
      { stroke: '#6504C1' },
    );
  }

  private getLabelText(playbookHandler: PlaybookHandler): string {
    return 'on true';
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
      this.getLabelText(playbookHandler),
      'end',
    );
    return elmt;
  }
}
