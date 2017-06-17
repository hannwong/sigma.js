;(function() {
  'use strict';

  sigma.utils.pkg('sigma.canvas.edges');

  /**
   * This edge renderer will display edges as curves.
   *
   * @param  {object}                   edge         The edge object.
   * @param  {object}                   source node  The edge source node.
   * @param  {object}                   target node  The edge target node.
   * @param  {CanvasRenderingContext2D} context      The canvas context.
   * @param  {configurable}             settings     The settings function.
   */
  sigma.canvas.edges.taperedCurve = function(edge, source, target, context, settings) {
    var color = edge.color,
        prefix = settings('prefix') || '',
        size = edge[prefix + 'size'] || 1,
        edgeColor = settings('edgeColor'),
        defaultNodeColor = settings('defaultNodeColor'),
        defaultEdgeColor = settings('defaultEdgeColor'),
        cp = {},
        sSize = source[prefix + 'size'],
        tSize = target[prefix + 'size'],
        sX = source[prefix + 'x'],
        sY = source[prefix + 'y'],
        tX = target[prefix + 'x'],
        tY = target[prefix + 'y'];

    cp = (source.id === target.id) ?
      sigma.utils.getSelfLoopControlPoints(sX, sY, sSize) :
      sigma.utils.getQuadraticControlPoint(sX, sY, tX, tY);

    if (edge.curvature !== undefined && source.id !== target.id) {
      cp = {
        x: (sX + tX) / 2 + (tY - sY) * edge.curvature,
        y: (sY + tY) / 2 + (sX - tX) * edge.curvature
      };
    }

    if (!color)
      switch (edgeColor) {
        case 'source':
          color = source.color || defaultNodeColor;
          break;
        case 'target':
          color = target.color || defaultNodeColor;
          break;
        default:
          color = defaultEdgeColor;
          break;
      }

    // Intersection points:
    var dist = sigma.utils.getDistance(cp.x, cp.y, sX, sY);
    var c = sigma.utils.getCircleIntersection(cp.x, cp.y, dist, sX, sY, size);

    // Draw the extra curves to form the taper.
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(c.xi, c.yi);
    context.quadraticCurveTo(cp.x, cp.y, tX, tY);
    context.quadraticCurveTo(cp.x, cp.y, c.xi_prime, c.yi_prime);
    context.fill();

    // Draw the actual curve itself.
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(sX, sY);
    context.quadraticCurveTo(cp.x, cp.y, tX, tY);
    context.stroke();
  };
})();
