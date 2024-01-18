import BaseLayouter, {
  Connection,
  LayoutConnectionHints,
  Point,
} from 'diagram-js/lib/layout/BaseLayouter';
import { assign } from 'min-dash';
import {
  repairConnection,
  withoutRedundantPoints,
} from 'diagram-js/lib/layout/ManhattanLayout';
import { Rect } from 'diagram-js/lib/layout/LayoutUtil';
import CacaoUtils from '../../core/CacaoUtils';
import CacaoFactory from '../../factory/CacaoFactory';
import { Shape } from 'diagram-js/lib/model';

/**
 * This class is a module
 * - module's entry points:
 *    - layoutConnection(..)
 * - goal:
 *    - it layout the connection by creating/updatig the waypoints
 *    - use the manhattan  layout to create the waypoints
 */
export default class CacaoLayouter extends BaseLayouter {
  /**
   * this is a method to get the center of a shape
   * @param shape
   * @returns a Point that represents the center of the shape
   */
  private getRectMid(shape: Rect): Point {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  }

  /**
   * this is a method to get the docking connection of the provided shape, if the point is undefined, returns the center of the shape
   * @param point
   * @param shape
   * @returns a docking point
   */
  private getConnectionDocking(point: any, shape: Rect): Point {
    return point ? point.original || point : this.getRectMid(shape);
  }

  /**
   * layout the connection using the manhattan layout from diagram-js
   *
   *  EXAMPLE: a straight line between two shapes become:
   *
   *        []---------
   *                  |
   *                  |
   *                  -------------[]
   *
   * @param connection the connection concerned
   * @param hints
   * @returns the waypoints updated by the layouter
   */
  layoutConnection(
    connection: Connection,
    hints: LayoutConnectionHints = {},
  ): Point[] {
    let source: Rect = hints.source || connection.source;
    let target: Rect = hints.target || connection.target;
    let waypoints: Point | Point[] = connection.waypoints;
    let connectionStart: Point = hints.connectionStart;
    let connectionEnd: Point = hints.connectionEnd;

    let manhattanOptions: any = {};
    let updatedWaypoints: Point[] | undefined;

    //waypoints = [];
    console.log(waypoints);

    if (!connectionStart) {
      connectionStart = this.getConnectionDocking(
        waypoints && waypoints[0],
        source,
      );
    }

    if (!connectionEnd) {
      connectionEnd = this.getConnectionDocking(
        waypoints && waypoints[waypoints.length - 1],
        target,
      );
    }

    //to avoid little miss alignement
    if (Math.abs(connectionEnd.x - connectionStart.x) < 5) {
      connectionEnd.x = connectionStart.x;
    }
    if (Math.abs(connectionEnd.y - connectionStart.y) < 5) {
      connectionEnd.y = connectionStart.y;
    }

    let cacaoConnection = CacaoFactory.getCacaoConnection(connection);
    if (cacaoConnection && CacaoUtils.isConnectionType(connection.type)) {
      manhattanOptions = {
        preferredLayouts: getAttachers(source as any, target as any), //[cacaoConnection.properties.attachers]
      };
    }

    if (manhattanOptions) {
      manhattanOptions = assign(manhattanOptions, hints);
      updatedWaypoints = repairConnection(
        source,
        target,
        connectionStart,
        connectionEnd,
        waypoints,
        manhattanOptions,
      );
      updatedWaypoints = withoutRedundantPoints(updatedWaypoints);
    }
    return updatedWaypoints || [connectionStart, connectionEnd];
  }
}

function alignPoint(point: Point): Point {
  if (point.x % 2 == 1) {
    point.x--;
  }
  if (point.y % 2 == 1) {
    point.y--;
  }
  return point;
}

function getAttachers(
  source: Shape | undefined,
  target: Shape | undefined,
): string[] {
  let MARGIN = 0;
  let verticalPos: 'bottom' | 'top' | 'middle';
  let horizontalPos: 'right' | 'left' | 'middle';

  if (!source || !target) {
    return [];
  }

  if (source.y - MARGIN > target.y + target.height) {
    verticalPos = 'top';
  } else if (source.y + source.height + MARGIN < target.y) {
    verticalPos = 'bottom';
  } else {
    verticalPos = 'middle';
  }

  if (source.x - MARGIN > target.x + target.width / 2) {
    horizontalPos = 'left';
  } else if (source.x + source.width / 2 + MARGIN < target.x) {
    horizontalPos = 'right';
  } else {
    horizontalPos = 'middle';
  }

  if (horizontalPos == 'right' && verticalPos == 'top') {
    return ['r:b'];
  } else if (horizontalPos == 'right' && verticalPos == 'bottom') {
    return ['b:l'];
  } else if (horizontalPos == 'right' && verticalPos == 'middle') {
    return ['r:l'];
  }

  if (horizontalPos == 'left' && verticalPos == 'top') {
    return ['l:b'];
  } else if (horizontalPos == 'left' && verticalPos == 'bottom') {
    return ['l:t'];
  } else if (horizontalPos == 'left' && verticalPos == 'middle') {
    return ['l:r'];
  }

  if (horizontalPos == 'middle' && verticalPos == 'top') {
    return ['t:b'];
  } else if (horizontalPos == 'middle' && verticalPos == 'bottom') {
    return ['b:t'];
  } else if (horizontalPos == 'middle' && verticalPos == 'middle') {
    return [];
  }
  return [];
}
