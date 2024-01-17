import { Shape, ShapeLike, Element } from 'diagram-js/lib/model/Types';
import CacaoElement, { CacaoConstructType } from '../CacaoBaseConstruct';
import { CacaoConnectionType } from '../../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import { DrawFactory, DrawProps } from '../../../modules/draw/DrawFactory';
import PlaybookHandler from '../../../modules/model/PlaybookHandler';
import CacaoUtils from '../../../modules/core/CacaoUtils';

export default class CacaoPlaybookActionConstruct extends CacaoElement {
  headerBackgroundColor = '#777777';
  backgroundColor = 'white';
  borderColor = '#000000';
  textColor = 'black';
  headerTextColor = 'white';

  constructor(shape: Shape | ShapeLike | Element | undefined) {
    super(shape, CacaoConstructType.PLAYBOOK_ACTION_STEP, {
      modelType: 'playbook-action',
      className: 'playbook-action-step',
      title: 'Playbook Action',
      width: 120,
      height: 60,
      resizable: false,
      incomingConnectionAllowed: Object.values(CacaoConnectionType),
      outgoingConnectionAllowed: [
        CacaoConnectionType.ON_COMPLETION,
        CacaoConnectionType.ON_FAILURE,
        CacaoConnectionType.ON_SUCCESS,
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
