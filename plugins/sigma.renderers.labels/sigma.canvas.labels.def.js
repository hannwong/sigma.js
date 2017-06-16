;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.canvas.labels');

  /**
   * Overrides default label.
   *
   * @param  {object}                   node     The node object.
   * @param  {CanvasRenderingContext2D} context  The canvas context.
   * @param  {configurable}             settings The settings function.
   */
  sigma.canvas.labels.def = function(node, context, settings) {
    var fontSize,
        prefix = settings('prefix') || '',
        size = node[prefix + 'size'];

    if (size < settings('labelThreshold'))
      return;

    if (!node.label || typeof node.label !== 'string')
      return;

    fontSize = (settings('labelSize') === 'fixed') ?
      settings('defaultLabelSize') :
      settings('labelSizeRatio') * size;

    if (node.labelSize !== undefined)
      fontSize = node.labelSize;

    context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
      fontSize + 'px ' + settings('font');
    context.fillStyle = (settings('labelColor') === 'node') ?
      (node.color || settings('defaultNodeColor')) :
      settings('defaultLabelColor');

    var labelX = Math.round(node[prefix + 'x'] + size + 3);
    var labelY = Math.round(node[prefix + 'y'] + fontSize / 3);
    if (node.labelX !== undefined) {
      labelX = Math.round(node[prefix + 'x'] + node.labelX);
    }
    if (node.labelY !== undefined)
      labelY = Math.round(node[prefix + 'y'] + node.labelY);

    context.fillText(node.label, labelX, labelY);
  };
}).call(this);
