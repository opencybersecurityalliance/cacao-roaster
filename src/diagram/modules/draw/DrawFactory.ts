import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
} from 'tiny-svg';
import { DrawUtils, StyleAttrs } from './DrawUtils';

export type DrawProps = {
  type: 'rectangle' | 'diamond' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  fileName?: string;
  numberOfLine?: number;
  styleAttrs: StyleAttrs;
};

/**
 * this class will call the correct method of DrawUtils depending of the type to props
 */
export class DrawFactory {
  static drawUtils = new DrawUtils();

  static create(props: DrawProps) {
    switch (props.type) {
      case 'rectangle':
        return this.drawUtils.getRectShape(
          props.x,
          props.y,
          props.width,
          props.height,
          props.styleAttrs,
        );
      case 'diamond':
        return this.drawUtils.getDiamondShape(
          props.x,
          props.y,
          props.width,
          props.height,
          props.styleAttrs,
        );
      case 'text':
        return this.drawUtils.getLabel(
          props.x,
          props.y,
          props.width,
          props.height,
          props.title ?? '',
          props.numberOfLine ?? 1,
          props.styleAttrs,
        );
    }
  }

  static drawAll(visuals: SVGElement, propsList: DrawProps[]) {
    for (let props of propsList) {
      svgAppend(visuals, this.create(props));
    }
  }
}
