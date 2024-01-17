import { Shape, ShapeLike, Element } from 'diagram-js/lib/model/Types';
import CacaoElement, { CacaoConstructType } from '../CacaoBaseConstruct';
import { CacaoConnectionType } from '../../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import { DrawFactory, DrawProps } from '../../../modules/draw/DrawFactory';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';

export default class CacaoEndConstruct extends CacaoElement {
  backgroundColor = '#DB6C6C';
  borderColor = '#7D0001';
  textColor = 'white';

  constructor(shape: Shape | ShapeLike | Element | undefined) {
    super(shape, CacaoConstructType.END_STEP, {
      modelType: 'end',
      className: 'end-step',
      title: 'End step',
      width: 60,
      height: 40,
      resizable: false,
      incomingConnectionAllowed: Object.values(CacaoConnectionType),
      outgoingConnectionAllowed: [],
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
      title: 'End',
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
