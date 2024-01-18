import EventBus from 'diagram-js/lib/core/EventBus';
import PlaybookHandler from '../../model/PlaybookHandler';
import CacaoModeling from '../modeling/CacaoModeling';
import { Playbook } from '../../../../../lib/cacao2-js/src/Playbook';
import { CacaoConstructType } from '../../../elements/constructs/CacaoBaseConstruct';
import Canvas, { Point } from 'diagram-js/lib/core/Canvas';
import { WorkflowStep } from 'lib/cacao2-js/src/workflows/WorkflowStep';
import { Identifier } from 'lib/cacao2-js/src/data-types/Identifier';
import CacaoAutoPlace from '../auto-place/CacaoAutoPlace';
import CacaoFactory from '../../factory/CacaoFactory';
import { CacaoConnectionType } from 'src/diagram/elements/connections/CacaoBaseConnection';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';
import { Connection, ShapeLike } from 'diagram-js/lib/model/Types';
import { assign } from 'min-dash';
import CacaoUtils from '../../core/CacaoUtils';

/**
 *
 */
export default class CacaoImporter {
  private _playbookHandler: PlaybookHandler;
  private _cacaoModeling: CacaoModeling;
  private _eventBus: EventBus;
  private _canvas: Canvas;
  private _cacaoAutoPlace: CacaoAutoPlace;
  private _elementRegistry: ElementRegistry;

  static $inject: string[];

  constructor(
    playbookHandler: PlaybookHandler,
    modeling: CacaoModeling,
    eventBus: EventBus,
    canvas: Canvas,
    cacaoAutoPlace: CacaoAutoPlace,
    elementRegistry: ElementRegistry,
  ) {
    this._playbookHandler = playbookHandler;
    this._cacaoModeling = modeling;
    this._eventBus = eventBus;
    this._canvas = canvas;
    this._cacaoAutoPlace = cacaoAutoPlace;
    this._elementRegistry = elementRegistry;

    this._eventBus.on('cacao.import.start', (event: any) => {
      let playbook: Playbook = event.playbook;
      this.loadPlaybook(playbook);
    });

    this._eventBus.on('load.workflow', (event: any) => {
      let playbook: Playbook = event.playbook;
      this.loadWorkflow(playbook);
    });
  }

  /**
   * this method add all the workflow steps to the canvas
   *  - 1) add start step to the canvas
   *  - 2) add every steps of the playbook to the canvas
   * @param playbook
   */
  private loadPlaybook(playbook: Playbook) {
    this._cacaoModeling.clearCanvas();
    this._playbookHandler.loadPlaybook(playbook);
    this.loadWorkflow(playbook);
    this._eventBus.fire('playbook.loaded', {});
  }

  /**
   * this method will load the workflow of the playbook in the canvas
   * @param playbook
   */
  loadWorkflow(playbook: Playbook) {
    let queue: {
      [k: string]: Partial<WorkflowStep>;
    } = new Playbook(playbook).workflow;

    let added = true;
    while (added) {
      added = false;
      for (let stepId in queue) {
        if (queue[playbook.workflow_start]) {
          stepId = playbook.workflow_start;
        } else {
          //if the step does not have any parent
          if (
            this._playbookHandler.getPreviousSteps(stepId, playbook).length != 0
          ) {
            continue;
          }
        }

        added = true;
        //add initial step to the canvas
        let step = queue[stepId];

        let list: [
          Partial<WorkflowStep>,
          Identifier,
          Partial<WorkflowStep> | undefined,
          Identifier | undefined,
          CacaoConnectionType | undefined,
        ][] = [];

        let previousStep: Partial<WorkflowStep> | undefined = undefined;
        let previousStepId: Identifier | undefined = undefined;
        let connectionType: CacaoConnectionType | undefined = undefined;

        list.push([step, stepId, previousStep, previousStepId, connectionType]);

        //load every steps connected to the start step
        while (list.length > 0) {
          [step, stepId, previousStep, previousStepId, connectionType] =
            list.shift() as [
              Partial<WorkflowStep>,
              Identifier,
              Partial<WorkflowStep> | undefined,
              Identifier | undefined,
              CacaoConnectionType | undefined,
            ];

          let alreadyExist = this._elementRegistry.get(stepId) != undefined;

          if (!previousStep || !previousStepId || !connectionType) {
            this.loadStep(step, stepId);
          } else {
            this.loadNextStep(
              step,
              stepId,
              previousStep,
              previousStepId,
              connectionType,
            );
          }

          delete queue[stepId];

          if (alreadyExist) {
            continue;
          }

          let nextList = this._playbookHandler.getNextSteps(step);

          for (let entry of nextList) {
            let [nextStepId, connectionType] = entry;
            let nextStep = playbook.workflow[nextStepId];

            list.push([nextStep, nextStepId, step, stepId, connectionType]);
          }
        }
        break;
      }
    }
  }

  /**
   * this method load a step in the canvas, this step will not take in count if it has incoming connection
   * @param step
   * @param stepId
   */
  private loadStep(step: Partial<WorkflowStep>, stepId: Identifier) {
    let position: Point;

    if (!step.type) {
      throw new Error('the type of a workflow step must be defined');
    }

    let cacaoConstruct = CacaoFactory.getCacaoConstruct(
      undefined,
      getCacaoTypeFromModelType(step.type),
    );

    if (!cacaoConstruct) {
      throw new Error('impossible to get cacao construct from workflow step');
    }

    let startShape: any = {
      id: stepId,
      modelAssociated: true,
      type: cacaoConstruct.type,
      width: cacaoConstruct.properties.width,
      height: cacaoConstruct.properties.height,
    };

    position = this._cacaoAutoPlace.getFirstShapePosition(startShape);

    assign(startShape, {
      x: position.x,
      y: position.y,
    });

    this._cacaoModeling.createShape(
      startShape,
      position,
      this._canvas.getRootElement() as any,
      0,
    );
  }

  /**
   * this method will laod a step in the canvas as a next step, so it will create the connection as well if this does not exist yet in the canvas
   * @param step
   * @param stepId
   * @param previousStep
   * @param previousStepId
   * @param connectionType
   * @returns
   */
  private loadNextStep(
    step: Partial<WorkflowStep>,
    stepId: Identifier,
    previousStep: Partial<WorkflowStep>,
    previousStepId: Identifier,
    connectionType: CacaoConnectionType,
  ) {
    let position: Point;

    if (
      !step?.type ||
      CacaoUtils.isUndefined(stepId) ||
      !previousStep ||
      CacaoUtils.isUndefined(previousStepId) ||
      !connectionType
    ) {
      throw new Error('every parameter should be defined');
    }

    let cacaoConstruct = CacaoFactory.getCacaoConstruct(
      undefined,
      getCacaoTypeFromModelType(step.type),
    );
    let source = this._elementRegistry.get(previousStepId) as ShapeLike;

    if (!cacaoConstruct || !source) {
      throw new Error(
        'impossible to get cacao construct from workflow step or source from previousStepId',
      );
    }

    if (this._elementRegistry.get(stepId)) {
      this._cacaoModeling.createConnection(
        source as any,
        this._elementRegistry.get(stepId) as any,
        0,
        {
          type: connectionType,
          waypoints: this._cacaoAutoPlace.getConnectionWaypoints(
            previousStepId,
            stepId,
            connectionType,
          ),
        },
        this._canvas.getRootElement() as any,
      );
      return;
    }

    let stepShape: any = {
      id: stepId,
      modelAssociated: true,
      type: cacaoConstruct.type,
      width: cacaoConstruct.properties.width,
      height: cacaoConstruct.properties.height,
      x: 0,
      y: 0,
    };

    let connection: Partial<Connection> = {
      type: connectionType,
      modelAssociated: true,
      waypoints: this._cacaoAutoPlace.getConnectionWaypoints(
        previousStepId,
        stepId,
        connectionType,
      ),
    };
    this._cacaoAutoPlace.appendShape(source, stepShape, connection);
  }
}

function getCacaoTypeFromModelType(modelType: string): CacaoConstructType {
  switch (modelType) {
    case 'start':
      return CacaoConstructType.START_STEP;
    case 'end':
      return CacaoConstructType.END_STEP;
    case 'playbook-action':
      return CacaoConstructType.PLAYBOOK_ACTION_STEP;
    case 'action':
      return CacaoConstructType.ACTION_STEP;
    case 'parallel':
      return CacaoConstructType.PARALLEL_STEP;
    case 'if-condition':
      return CacaoConstructType.IF_CONDITION_STEP;
    case 'while-condition':
      return CacaoConstructType.WHILE_CONDITION_STEP;
    case 'switch-condition':
      return CacaoConstructType.SWITCH_CONDITION_STEP;
  }
  throw new Error('type not implemented : ' + modelType);
}

CacaoImporter.$inject = [
  'playbookHandler',
  'modeling',
  'eventBus',
  'canvas',
  'cacaoAutoPlace',
  'elementRegistry',
];
