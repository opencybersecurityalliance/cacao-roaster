import { Shape, ShapeLike, Element } from 'diagram-js/lib/model/Types';
import CacaoElement, { CacaoConstructType } from '../CacaoBaseConstruct';
import { CacaoConnectionType } from '../../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import { DrawFactory, DrawProps } from '../../../modules/draw/DrawFactory';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import CacaoUtils from '../../../modules/core/CacaoUtils';

export default class CacaoParallelConstruct extends CacaoElement {
  backgroundColor = 'white';
  borderColor = '#AC7F0C';
  textColor = '#28293E';

  headerBackgroundColor = '#C7AE6F';
  headerTextColor = 'white';

  constructor(shape: Shape | ShapeLike | Element | undefined) {
    super(shape, CacaoConstructType.PARALLEL_STEP, {
      modelType: 'parallel',
      className: 'parallel-step',
      title: 'Parallel step',
      width: 120,
      height: 60,
      resizable: false,
      incomingConnectionAllowed: Object.values(CacaoConnectionType),
      outgoingConnectionAllowed: [
        CacaoConnectionType.ON_COMPLETION,
        CacaoConnectionType.ON_FAILURE,
        CacaoConnectionType.ON_SUCCESS,
        CacaoConnectionType.ON_PARALLEL,
      ],
    });
  }

  override drawConstruct(
    visuals: SVGElement,
    shape: Shape,
    workflowStep: WorkflowStep,
    playbookHandler: PlaybookHandler,
  ): SVGElement {
    let propsList: DrawProps[] = [];

    propsList.push(
      ...this.getPrincipalShapeProps(
        shape,
        workflowStep,
        this.borderColor,
        this.headerBackgroundColor,
      ),
    );
    propsList.push(
      this.getExecutionStatusDotProps(
        shape,
        playbookHandler.getShapeStatus(shape.id),
      ),
    );

    DrawFactory.drawAll(visuals, propsList);
    return visuals;
  }
}
