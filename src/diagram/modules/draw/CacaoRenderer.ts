import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import EventBus from 'diagram-js/lib/core/EventBus';
import CacaoUtils from '../core/CacaoUtils';
import { Connection, Shape } from 'diagram-js/lib/model/Types';
import CacaoBaseConstruct from '../../elements/constructs/CacaoBaseConstruct';
import CacaoBaseConnection from '../../elements/connections/CacaoBaseConnection';
import Canvas from 'diagram-js/lib/core/Canvas';
import CacaoFactory from '../factory/CacaoFactory';
import PlaybookHandler from '../model/PlaybookHandler';

/**
 * This class is a module
 * - module's entry points:
 *    - drawConnection(..) & drawShape(...)
 * - goal:
 *    - it render all the cacao constructs and cacao connection
 */
export default class CacaoRenderer extends BaseRenderer {
  _canvas: Canvas;
  _playbookHandler: PlaybookHandler;

  static $inject: string[];

  constructor(
    eventBus: EventBus,
    canvas: Canvas,
    playbookHandler: PlaybookHandler,
  ) {
    super(eventBus, 1000);
    BaseRenderer.call(this, eventBus, 1001);
    this._canvas = canvas;
    this._playbookHandler = playbookHandler;
  }
}

/**
 * this method find out if we can or not render the provided element
 * @param element
 * @returns boolean: True if it is a CacaoConnection or a CacaoConstruct, False otherwise
 */
CacaoRenderer.prototype.canRender = function (element: any): boolean {
  let type: any;
  let returnValue = false;
  try {
    type = CacaoUtils.getTypeOfElement(element);
    returnValue =
      CacaoUtils.isConnectionType(type) || CacaoUtils.isConstructType(type);
  } catch (error) {}
  return returnValue;
};

/**
 * this method draw the shape on the canvas
 * @param visuals
 * @param shape
 * @return the created SVGElement
 */
CacaoRenderer.prototype.drawShape = function (
  visuals: SVGElement,
  shape: Shape,
) {
  let cacaoElement: CacaoBaseConstruct | undefined;
  cacaoElement = CacaoFactory.getCacaoConstruct(shape);
  if (!cacaoElement || !cacaoElement.id) {
    throw new Error('not a cacao construct | need id');
  }
  let workflowStep = this._playbookHandler.getStep(cacaoElement.id);

  let elmt = cacaoElement.drawConstruct(
    visuals,
    shape,
    workflowStep,
    this._playbookHandler,
  );
  return elmt;
};

/**
 * this method draw the connection on the canvas
 * @param visuals
 * @param connection
 * @return the created SVGElement
 */
CacaoRenderer.prototype.drawConnection = function (
  visuals: SVGElement,
  connection: Connection,
) {
  let cacaoElement: CacaoBaseConnection | undefined;
  cacaoElement = CacaoFactory.getCacaoConnection(connection);
  if (!cacaoElement) {
    throw new Error('CacaoRenderer::drawConnection -> not a cacao connection');
  }
  let elmt = cacaoElement.drawConnection(
    this._playbookHandler,
    this._canvas,
    visuals,
    connection,
  );
  return elmt;
};

CacaoRenderer.$inject = ['eventBus', 'canvas', 'playbookHandler'];
