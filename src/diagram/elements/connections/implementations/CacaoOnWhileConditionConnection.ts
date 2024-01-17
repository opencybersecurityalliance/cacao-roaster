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
import CacaoFactory from '../../../modules/factory/CacaoFactory';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import CacaoUtils from '../../../modules/core/CacaoUtils';

export default class CacaoOnWhileConditionConnection extends CacaoBaseConnection {
  constructor(connection: Connection | ConnectionLike | Element | undefined) {
    super(
      connection,
      CacaoConnectionType.ON_WHILE_CONDITION,
      {
        attachers: 'b:l',
        className: 'on-true-condition',
        neighborConnectionAllowed: Object.values(CacaoConnectionType).filter(
          type => !CacaoUtils.is(type, CacaoConnectionType.ON_WHILE_CONDITION),
        ),
      },
      { stroke: '#6504C1' },
    );
  }

  private getLabelText(playbookHandler: PlaybookHandler): string {
    let cacaoSource = CacaoFactory.getCacaoConstruct(this.source);
    let cacaoTarget = CacaoFactory.getCacaoConstruct(this.target);
    if (!cacaoSource || !cacaoTarget) {
      return '';
    }
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
