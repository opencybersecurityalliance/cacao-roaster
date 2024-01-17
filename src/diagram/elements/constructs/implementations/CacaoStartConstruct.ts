import { Shape, ShapeLike, Element } from 'diagram-js/lib/model/Types';
import CacaoElement, {
  CacaoConstructType,
  StyleAttrs,
} from '../CacaoBaseConstruct';
import { CacaoConnectionType } from '../../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import { DrawFactory, DrawProps } from '../../../modules/draw/DrawFactory';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';

export default class CacaoStartConstruct extends CacaoElement {
  backgroundColor = '#6FC78D';
  borderColor = '#008127';
  textColor = 'white';

  //"#DBFFD6";

  constructor(shape: Shape | ShapeLike | Element | undefined) {
    super(shape, CacaoConstructType.START_STEP, {
      modelType: 'start',
      className: 'start-step',
      title: 'Start step',
      width: 60,
      height: 40,
      resizable: false,
      incomingConnectionAllowed: [],
      outgoingConnectionAllowed: [CacaoConnectionType.ON_COMPLETION],
    });
  }

  override drawConstruct(
    visuals: SVGElement,
    shape: Shape,
    workflowStep: WorkflowStep,
    playbookHandler: PlaybookHandler,
  ): SVGElement {
    let propsList: DrawProps[] = [];

    propsList.push(this.getBackgroundProps(shape));
    propsList.push(this.getLabelProps(shape));

    DrawFactory.drawAll(visuals, propsList);
    return visuals;
  }

  getLabelProps(shape: Shape): DrawProps {
    return {
      type: 'text',
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      title: 'Start',
      numberOfLine: 1,
      styleAttrs: {
        fill: this.textColor,
        strokeOpacity: 0,
        fontSize: 12,
        align: 'center-middle',
      },
    };
  }

  getBackgroundProps(shape: Shape): DrawProps {
    return {
      type: 'rectangle',
      x: 0,
      y: 0,
      width: shape.width,
      height: shape.height,
      styleAttrs: {
        fill: this.backgroundColor,
        stroke: this.borderColor,
      },
    };
  }
}
