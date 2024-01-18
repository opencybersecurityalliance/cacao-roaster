import { CommandHandler } from 'diagram-js/lib/command/CommandStack';
import CacaoModeling from '../CacaoModeling';
import { assign, forEach } from 'min-dash';
import { Connection, Shape } from 'diagram-js/lib/model/Types';
import {
  getResizedSourceAnchor,
  getResizedTargetAnchor,
} from 'diagram-js/lib/features/modeling/cmd/helper/AnchorsHelper';
import GraphicsFactory from 'diagram-js/lib/core/GraphicsFactory';
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry';

export default class UpdateShapeHandler implements CommandHandler {
  static $inject: string[];

  private _modeling: CacaoModeling;
  private _graphicsFactory: GraphicsFactory;
  private _elementRegistry: ElementRegistry;

  constructor(
    modeling: CacaoModeling,
    graphicsFactory: GraphicsFactory,
    elementRegistry: ElementRegistry,
  ) {
    this._modeling = modeling;
    this._graphicsFactory = graphicsFactory;
    this._elementRegistry = elementRegistry;
  }

  execute(context: any) {
    let shape = context.shape;
    let step = context.step;
    let oldStep = context.oldStep;

    if (!shape) {
      throw new Error('[shape, oldStep, step] must be defined');
    }

    context.oldStep = structuredClone(step);

    this.updateGraphicalShape(shape);

    return shape;
  }

  updateGraphicalShape(shape: Shape) {
    this._graphicsFactory.update(
      'shape',
      shape,
      this._elementRegistry.getGraphics(shape),
    );
  }

  postExecute(context: any) {
    var shape = context.shape,
      oldShape = context.oldShape,
      hints = context.hints || {};

    if (hints.layout === false) {
      return;
    }

    forEach(shape.incoming, (c: Connection) => {
      this._modeling.layoutConnection(c, {
        connectionEnd: getResizedTargetAnchor(c, shape, oldShape),
      });
    });

    forEach(shape.outgoing, (c: Connection) => {
      this._modeling.layoutConnection(c, {
        connectionStart: getResizedSourceAnchor(c, shape, oldShape),
      });
    });
  }

  revert(context: any): any {
    var shape = context.shape,
      oldShape = context.oldShape;

    // Restore previous bbox
    assign(shape, {
      widht: oldShape.width,
      height: oldShape.height,
    });

    return shape;
  }
}

UpdateShapeHandler.$inject = ['modeling', 'graphicsFactory', 'elementRegistry'];
