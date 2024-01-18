import Canvas from 'diagram-js/lib/core/Canvas';
import CacaoUtils from '../../../modules/core/CacaoUtils';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';
import { query as domQuery } from 'min-dom';

/**
 * class that provide methods to create markers to pu on a connection
 */
export default class MarkerUtil {
  private markers: string[] = [];

  constructor() {}

  /**
   * this is a method to get the end marker of a given color.
   * this method store al the created markers to not create them twice
   * @param canvas
   * @param color the desired color
   * @returns a reference to the marker EX: url(#...)
   */
  public getEndMarker(canvas: Canvas, color: string): string {
    let markerId: string;

    markerId = 'cacao-marker-' + CacaoUtils.escapeString(color);

    if (!this.markers.includes(markerId)) {
      this.createEndMarker(canvas, color, markerId);
    }

    return 'url(#' + markerId + ')';
  }

  /**
   * this method create a end marker
   * @param canvas
   * @param color
   * @param markerId
   */
  private createEndMarker(canvas: Canvas, color: string, markerId: string) {
    let element: SVGElement;
    let marker: SVGElement;

    element = svgCreate('path', {
      d: 'M 1 5 L 11 10 L 1 15 Z',
      fill: color,
    });

    marker = svgCreate('marker', {
      id: markerId,
      viewBox: '0 0 20 20',
      refX: 11,
      refY: 10,
      markerWidth: 10,
      markerHeight: 10,
      orient: 'auto',
    });

    svgAppend(marker, element);
    var defs = domQuery('defs', (canvas as any)._svg);

    if (!defs) {
      defs = svgCreate('defs');
      svgAppend((canvas as any)._svg, defs);
    }

    svgAppend(defs, marker);
    this.markers.push(markerId);
  }
}
