import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
  KeyValue,
} from 'tiny-svg';
import { assign } from 'min-dash';
import TextUtil from 'diagram-js/lib/util/Text';
import { transform } from 'diagram-js/lib/util/SvgTransformUtil';

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

/**
 * this class contains all the method used to create SVGElement using props
 */
export class DrawUtils {
  defaultStyle: StyleAttrs = {
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

  getLabel(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    numberOfLine: number,
    attrs: StyleAttrs,
  ): SVGElement {
    let label: SVGElement;

    attrs = assign(structuredClone(this.defaultStyle), attrs);

    let option: any = {
      box: {
        height: height,
        width: width,
      },
      align: attrs.align,
      padding: attrs.padding,
      style: {
        ...attrs,
      },
      size: {
        height: 100,
        width: 100,
      },
    };

    label = this.getTextElement(text, option, numberOfLine);

    svgClasses(label).add('djs-label');
    transform(label, x, y, 0);
    return label;
  }

  resizeText(text: string, fontSize: number, width: number) {
    if (text.length * fontSize > width) {
      return text.slice(0, width / fontSize) + '...';
    }
    return text;
  }

  getRectShape(
    x: number,
    y: number,
    width: number,
    height: number,
    attrs: StyleAttrs,
  ): SVGElement {
    let rect: SVGRectElement;

    attrs = assign(structuredClone(this.defaultStyle), attrs);

    rect = svgCreate('rect');

    svgAttr(rect, {
      x: x,
      y: y,
      width: width,
      height: height,
      ...attrs,
    });

    svgAttr(rect, attrs);
    return rect;
  }

  getDiamondShape(
    x: number,
    y: number,
    width: number,
    height: number,
    attrs: StyleAttrs,
  ): SVGElement {
    attrs = assign(structuredClone(this.defaultStyle), attrs);

    let x_min = x;
    let x_mid = x + width / 2;
    let x_max = x + width;

    let y_min = y;
    let y_mid = y + height / 2;
    let y_max = y + height;

    let polygon: SVGPolygonElement;

    var points = [
      { x: x_mid, y: y_min },
      { x: x_max, y: y_mid },
      { x: x_mid, y: y_max },
      { x: x_min, y: y_mid },
    ];

    var pointsString = points
      .map(function (point) {
        return point.x + ',' + point.y;
      })
      .join(' ');

    polygon = svgCreate('polygon');

    svgAttr(polygon, {
      points: pointsString,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
    });

    svgAttr(polygon, attrs);
    return polygon;
  }

  /**
   * this method will create a SVGElement with a specific number of line. In the case were your text is bigger, it will cut it and put "..." at the end
   * @param text the string
   * @param option contains all the option as the style for example
   * @param lineNumber max number of line for the text
   * @returns
   */
  getTextElement(text: string, option: any, lineNumber: number): SVGElement {
    /*let text = "";
        for(let index = 0; index<lineNumber ; index++) {
            if(label.firstChild) {
                text += (label.firstChild as any).innerText;
                label.removeChild(label.firstChild);
            }
        }*/
    var label = this.textUtil.createText(text, option);
    let renderedNumberLine = label.children.length;
    if (renderedNumberLine > lineNumber) {
      let newText = '';
      for (let index = 0; index < lineNumber; index++) {
        if (label.firstChild) {
          newText += (label.firstChild as any).innerHTML;
          label.removeChild(label.firstChild);
        }
      }
      if (newText.length > 5) {
        newText = newText.slice(0, newText.length - 3) + '...';
      }
      label = this.textUtil.createText(newText, option);
    }

    return label;
  }
}
