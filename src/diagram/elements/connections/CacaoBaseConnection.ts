import {
  Connection,
  ConnectionLike,
  Element,
  Shape,
} from 'diagram-js/lib/model/Types';
import { append as svgAppend, classes as svgClasses, KeyValue } from 'tiny-svg';
import { assign } from 'min-dash';
import { createLine } from 'diagram-js/lib/util/RenderUtil';
import Canvas from 'diagram-js/lib/core/Canvas';
import MarkerUtil from './util/CacaoMarker';
import TextUtil from 'diagram-js/lib/util/Text';
import CacaoConnectionLabelUtil from './util/CacaoConnectionLabel';
import PlaybookHandler from '../../modules/model/PlaybookHandler';

export enum CacaoConnectionType {
  ON_SWITCH_CONDITION = 'cases',
  ON_WHILE_CONDITION = 'on-true',
  ON_IF_TRUE_CONDITION = 'on-true',
  ON_IF_FALSE_CONDITION = 'on-false',
  ON_PARALLEL = 'next-steps',
  ON_COMPLETION = 'on-completion',
  ON_SUCCESS = 'on-success',
  ON_FAILURE = 'on-failure',
}

export type CacaoConnectionProps = {
  attachers: string; // b:bottom  t:top  l:left  r:right
  className: string;
  neighborConnectionAllowed: CacaoConnectionType[];
};

export default abstract class CacaoBaseConnection {
  /* common properties */
  protected DEFAULT_EMBEDDED_TEXT_SIZE = 12;
  protected DEFAULT_BORDER_RADIUS = 5;

  protected defaultStyle: KeyValue = {
    stroke: 'black',
    strokeWidth: 1,
    strokeOpacity: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'white',
    fillOpacity: 0,
  };

  protected textUtil = new TextUtil({
    style: this.defaultStyle,
  });

  protected CacaoMarkerUtil = new MarkerUtil();

  private _connectionProps: CacaoConnectionProps;
  private _connectionType: CacaoConnectionType;
  private _style: KeyValue;
  private _connection: any;

  constructor(
    connection: Connection | ConnectionLike | Element | undefined,
    type: CacaoConnectionType,
    props: CacaoConnectionProps,
    customStyle: KeyValue,
  ) {
    this._connectionType = type;
    this._connectionProps = props;
    this._style = this.defaultStyle;
    this._connection = connection;
    assign(this._style, customStyle); //override default style properties
  }

  /**
   * contains all the properties of a cacao connection
   */
  public get properties(): CacaoConnectionProps {
    return this._connectionProps;
  }

  /**
   * the type of the cacao connection
   */
  public get type(): CacaoConnectionType {
    return this._connectionType;
  }

  /**
   * An id that uniqually identify the current instance of the cacao connection
   * This id was provided by Diagram-js at the creation of the visual element
   */
  public get id(): String | undefined {
    if (this._connection) {
      return this._connection.id;
    }
    return undefined;
  }

  /**
   * The source of the connection.
   */
  public get source(): Shape | undefined {
    if (this._connection) {
      return this._connection.source;
    }
    return undefined;
  }

  /**
   * the target of the connection.
   */
  public get target(): Shape | undefined {
    if (this._connection) {
      return this._connection.target;
    }
    return undefined;
  }

  /**
   * return the drawing attributs like color, end markers, etc
   * @param canvas
   * @returns
   */
  protected getDrawingAttributs(canvas: Canvas): KeyValue {
    let attributs: KeyValue = {};

    assign(attributs, this._style, {
      markerEnd: this.CacaoMarkerUtil.getEndMarker(canvas, this._style.stroke),
    });

    return attributs;
  }

  /**
   * this method create the visual element corresponding to the connection
   * @param playbookHandler
   * @param canvas
   * @param visuals
   * @param element
   */
  abstract drawConnection(
    playbookHandler: PlaybookHandler,
    canvas: Canvas,
    visuals: SVGElement,
    element: Connection,
  ): SVGElement;

  equals(other: any): boolean {
    if (this.id && other.id) {
      return this.id === other.id;
    }
    return false;
  }

  ////// utils functions ///////

  /**
   * this method create a line and add it to parentGFX
   * @param parentGfx
   * @param element
   * @param attrs
   * @returns
   */
  protected drawLineConnection(
    parentGfx: SVGElement,
    element: Connection,
    attrs: KeyValue,
  ) {
    let line: SVGElement;

    line = createLine(element.waypoints, attrs, this.DEFAULT_BORDER_RADIUS);

    svgAppend(parentGfx, line);
    return line;
  }

  /**
   * this method create a label and add it to parentGFX
   * @param visuals
   * @param element
   * @param text
   * @param preferredPosition
   */
  protected drawEmbeddedLabel(
    visuals: SVGElement,
    element: Connection,
    text: string,
    preferredPosition: 'begin' | 'end' = 'begin',
  ) {
    let label: SVGElement;

    let option: any = {
      box: element,
      align: 'center-middle',
      style: {
        fill: this._style.stroke,
        strokeOpacity: 0,
        fillOpacity: 1,
        fontFamily: 'poppins, sans-serif',
        fontSize: 11,
        fontWeight: '200',
        lineHeight: 1,
      },
    };

    label = this.textUtil.createText(text, option);
    svgClasses(label).add('djs-label');
    svgAppend(visuals, label);
    CacaoConnectionLabelUtil.defineLabelPosition(
      label,
      element,
      preferredPosition,
    );
  }
}
