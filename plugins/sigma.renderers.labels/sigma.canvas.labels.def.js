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
    if (node.label === undefined)
      return;

    // If node.label is not an array, make it a 1-element array.
    var labels = node.label;
    if (!Array.isArray(node.label)) {
      labels = [];
      labels.push(node.label);
    }

    var label;
    for (var i = 0; i < labels.length; i++) {
      label = labels[i];

      var fontSize,
          prefix = settings('prefix') || '',
          size = node[prefix + 'size'];

      if (size < settings('labelThreshold'))
        return;

      if (!label.label || typeof label.label !== 'string')
        continue;

      fontSize = (settings('labelSize') === 'fixed') ?
        settings('defaultLabelSize') :
        settings('labelSizeRatio') * size;

      if (label.labelSize !== undefined)
        fontSize = label.labelSize;

      if (label.weight === undefined)
        label.weight = '400';

      context.font = (settings('fontStyle') ? settings('fontStyle') + ' ' : '') +
        label.weight + ' ' +
        fontSize + 'px ' + settings('font');
      context.fillStyle = (settings('labelColor') === 'node') ?
        (label.color || settings('defaultNodeColor')) :
        settings('defaultLabelColor');

      var labelX = Math.round(node[prefix + 'x'] + size + 3);
      var labelY = Math.round(node[prefix + 'y'] + fontSize / 3);
      if (label.labelX !== undefined) {
        labelX = Math.round(node[prefix + 'x'] + label.labelX);
      }
      if (label.labelY !== undefined)
        labelY = Math.round(node[prefix + 'y'] + label.labelY);

      context.fillText(label.label, labelX, labelY);
    }
  };
}).call(this);
