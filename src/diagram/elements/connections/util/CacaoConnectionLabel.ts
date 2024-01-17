import { Connection } from 'diagram-js/lib/model/Types';
import { transform } from 'diagram-js/lib/util/SvgTransformUtil';

type Point = {
  x: number;
  y: number;
};
type Orientation = 'top' | 'right' | 'bottom' | 'left';

export default class CacaoConnectionLabelUtil {
  /**
   * this is a method to define the position of the label depending on the orientation of the connection
   *
   *  - the numbers refers to the different possibilities (CF comments in the code)
   *
   *                            |
   *                            |
   *                         1  |  2
   *                      -------------
   *                    8 |           |  3
   *              --------|           |---------
   *                    7 |           |  4
   *                      -------------
   *                         6  |  5
   *                            |
   *                            |
   *
   *
   * @param label the label to place
   * @param connection
   * @param preferredPosition either "begin" or "end" depending if you want the label to be at the beginning or the end of the connection
   */
  public static defineLabelPosition(
    label: SVGElement,
    connection: Connection,
    preferredPosition: 'begin' | 'end',
  ) {
    let translateX: number;
    let translateY: number;
    let waypoints: any = connection.waypoints;

    if (!waypoints && waypoints.length > 1) {
      return;
    }

    let labelBounds = (label as any).getBBox();
    labelBounds.x -= 5;
    labelBounds.y -= 5;
    labelBounds.height += 10;
    labelBounds.width += 10;
    translateX = -labelBounds.x;
    translateY = -labelBounds.y;

    let dockingPoint: Point;
    let orientation: Orientation | undefined;

    switch (preferredPosition) {
      case 'begin':
        dockingPoint = waypoints[0];
        orientation = CacaoConnectionLabelUtil.getOrientation(
          waypoints[0],
          waypoints[1],
        );
        break;
      case 'end':
        dockingPoint = waypoints[waypoints.length - 1];
        orientation = CacaoConnectionLabelUtil.getOrientation(
          waypoints[waypoints.length - 1],
          waypoints[waypoints.length - 2],
        );
        break;
    }

    translateX += dockingPoint.x;
    translateY += dockingPoint.y;

    if (!orientation) {
      return;
    }

    switch (orientation) {
      case 'top': // cases 1 & 2
        translateY -= labelBounds.height;
        break;
      case 'bottom': // cases 5 & 6
        break;
      case 'right': // cases 3 & 4
        translateY -= labelBounds.height;
        break;
      case 'left': // cases 7 & 8
        translateY -= labelBounds.height;
        translateX -= labelBounds.width;
        break;
    }
    transform(label, translateX, translateY, 0);
  }

  /**
   * this is a method to know the orientation of a connection starting with first and ending with second
   * @param first starting point of the connection
   * @param second ending point of the connection
   * @returns an orientation or undefined if the line is not vertical/horizontal
   */
  private static getOrientation(
    first: Point,
    second: Point,
  ): Orientation | undefined {
    if (first.x == second.x) {
      if (first.y < second.y) {
        return 'bottom';
      } else {
        return 'top';
      }
    }

    if (first.y == second.y) {
      if (first.x < second.x) {
        return 'right';
      } else {
        return 'left';
      }
    }

    return undefined;
  }
}
