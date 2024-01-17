import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
  KeyValue,
} from 'tiny-svg';
import { assign } from 'min-dash';
import TextUtil from 'diagram-js/lib/util/Text';
import {
  Shape,
  ShapeLike,
  Element,
  Connection,
} from 'diagram-js/lib/model/Types';
import { CacaoConnectionType } from '../connections/CacaoBaseConnection';
import { WorkflowStep } from '../../../../lib/cacao2-js/src/workflows/WorkflowStep';
import PlaybookHandler from '../../modules/model/PlaybookHandler';
import { DrawProps } from '../../modules/draw/DrawFactory';
import {
  executionStatusColor,
  executionStatusColorStrong,
} from '../../modules/model/SchemaTypes';
import CacaoUtils from '../../modules/core/CacaoUtils';

export enum CacaoConstructType {
  START_STEP = 'cacao:startStep',
  END_STEP = 'cacao:endStep',
  ACTION_STEP = 'cacao:actionStep',
  PLAYBOOK_ACTION_STEP = 'cacao:playbookActionStep',
  PARALLEL_STEP = 'cacao:parallelStep',
  IF_CONDITION_STEP = 'cacao:ifConditionStep',
  WHILE_CONDITION_STEP = 'cacao:whileConditionStep',
  SWITCH_CONDITION_STEP = 'cacao:switchConditionStep',
}

export type CacaoConstructProps = {
  width: number;
  height: number;
  resizable: boolean;
  incomingConnectionAllowed: CacaoConnectionType[];
  outgoingConnectionAllowed: CacaoConnectionType[];
  className: string;
  modelType: string;
  title: string;
};

export type StyleAttrs = KeyValue & {
  rx?: number;
  ry?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  lineHeight?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  align?: string;
  padding?: number;
};

export default abstract class CacaoBaseConstruct {
  /* **common properties** */
  protected DEFAULT_BORDER_RADIUS = 7;
  protected DEFAULT_EMBEDDED_TEXT_SIZE = 16;

  protected defaultStyle: StyleAttrs = {
    fontFamily: 'Arial, sans-serif',
    fontSize: 10,
    fontWeight: 'medium',
    lineHeight: 1,
    stroke: 'black',
    strokeWidth: 1,
    strokeOpacity: 1,
    fill: 'white',
    fillOpacity: 1,
    align: 'center-top',
    padding: 0,
    rx: 7,
    ry: 7,
  };
  protected textUtil = new TextUtil({
    style: this.defaultStyle,
  });

  /* specific properties */
  private _constructProps: CacaoConstructProps;
  private _constructType: CacaoConstructType;
  private _style: KeyValue;
  private _shape: any;

  constructor(
    shape: Shape | ShapeLike | Element | undefined,
    type: CacaoConstructType,
    props: CacaoConstructProps,
  ) {
    this._constructType = type;
    this._constructProps = props;
    this._style = this.defaultStyle;
    this._shape = shape;
  }

  /**
   * this method return the outgoing connection of the Shape.
   */
  public get outgoingConnections(): Connection[] | undefined {
    if (this._shape) {
      return this._shape.outgoing;
    }
    return undefined;
  }

  /**
   * this method return the incoming connection of the Shape
   */
  public get incomingConnections(): Connection[] | undefined {
    if (this._shape) {
      return this._shape.incoming;
    }
    return undefined;
  }

  public get shape(): Shape | undefined {
    return this._shape;
  }

  /**
   * this method return the id of the shape, It is both the id that represent the shape in diagram-js and in the playbook.
   */
  public get id(): string | undefined {
    if (this._shape) {
      return this._shape.id;
    }
    return undefined;
  }

  /**
   * return true if the shape correspond to a step in the playbook
   */
  public get modelAssociated(): boolean | undefined {
    if (this._shape) {
      return this._shape.modelAssociated;
    }
    return undefined;
  }
  public get properties(): CacaoConstructProps {
    return this._constructProps;
  }
  public get type(): CacaoConstructType {
    return this._constructType;
  }
  protected get drawingAttributs(): KeyValue {
    let attributs: KeyValue = {};
    assign(attributs, this._style);
    return attributs;
  }

  abstract drawConstruct(
    visuals: SVGElement,
    element: Shape,
    workflowStep: WorkflowStep,
    playbookHandler: PlaybookHandler,
  ): SVGElement;

  /**
   * this method returns the props to render the dot for the execution status
   * @param shape
   * @param value
   * @returns
   */
  getExecutionStatusDotProps(shape: Shape, value: any): DrawProps {
    let strokeColor = executionStatusColorStrong[value ?? ''];
    let fillColor = executionStatusColor[value ?? ''];

    return {
      type: 'rectangle',
      x: shape.width - 15,
      y: 5,
      width: 10,
      height: 10,
      styleAttrs: {
        fill: fillColor ?? 'white',
        stroke: strokeColor ?? 'black',
        filter:
          'drop-shadow(0px 0px 1.5px ' + (strokeColor ?? 'rgb(50,50,50)') + ')',
        strokeOpacity: 1,
        strokeWidth: 0.7,
        rx: 10,
        ry: 10,
      },
    };
  }

  equals(other: any): boolean {
    if (this.id && other.id) {
      return this.id === other.id;
    }
    return false;
  }

  /**
   * this method return the props to render the principal shape on the canvas
   * @param shape
   * @param workflowStep
   * @param borderColor
   * @param headerBackgroundColor
   * @returns
   */
  getPrincipalShapeProps(
    shape: Shape,
    workflowStep: WorkflowStep,
    borderColor: string,
    headerBackgroundColor: string,
  ): DrawProps[] {
    let background = (shape: Shape): DrawProps => {
      return {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: shape.width,
        height: shape.height,
        styleAttrs: {
          fill: 'white',
          strokeOpacity: 0,
        },
      };
    };

    let header = (shape: Shape): DrawProps[] => {
      let headerBackgroundProps1: DrawProps = {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: shape.width,
        height: 20,
        styleAttrs: {
          fill: headerBackgroundColor,
          strokeOpacity: 0,
        },
      };

      let headerBackgroundProps2: DrawProps = {
        type: 'rectangle',
        x: 0,
        y: 10,
        width: shape.width,
        height: 10,
        styleAttrs: {
          fill: headerBackgroundColor,
          strokeOpacity: 0,
          rx: 0,
          ry: 0,
        },
      };

      let headerLabelProps: DrawProps = {
        type: 'text',
        x: 7,
        y: 0,
        width: shape.width,
        height: 20,
        title: (workflowStep?.type ?? '') + ' Step',
        numberOfLine: 1,
        styleAttrs: {
          fill: 'white',
          strokeOpacity: 0,
          fontSize: 10,
          align: 'left-middle',
        },
      };

      return [headerBackgroundProps1, headerBackgroundProps2, headerLabelProps];
    };

    let name = (shape: Shape, description: string): DrawProps => {
      return {
        type: 'text',
        x: 5,
        y: 20,
        width: shape.width - 10,
        height: shape.height - 20,
        title: description,
        numberOfLine: 4,
        styleAttrs: {
          fill: 'black',
          strokeOpacity: 0,
          fontSize: 8,
          align: 'center-middle',
        },
      };
    };

    let border = (shape: Shape): DrawProps => {
      return {
        type: 'rectangle',
        x: 0,
        y: 0,
        width: shape.width,
        height: shape.height,
        styleAttrs: {
          fillOpacity: 0,
          stroke: borderColor,
        },
      };
    };

    return [
      background(shape),
      ...header(shape),
      name(
        shape,
        CacaoUtils.isDefined(workflowStep?.name)
          ? workflowStep.name
          : 'Add name',
      ),
      border(shape),
    ];
  }
}
