function Plotter(ctx, graph, w, h) {
  var self = this;

  this.ctx = ctx;
  this.graph = graph;
  this.width = w;
  this.height = h;

  this.currentEdgeIndex = 0;
  this.currentNodeIndex = 0;

  this.edgesSpeed = 10;
  this.nodesSpeed = 10;

  this.worker_drawEdge = function() {
    var c = self.graph.edges.length;
    var i = 0;
    while (i++< self.edgesSpeed && self.currentEdgeIndex < c) {
      if (!self.isOnScreen(
           self.graph.edges[self.currentEdgeIndex]['source']
         ) &&
         !self.isOnScreen(
           self.graph.edges[self.currentEdgeIndex]['target'])
         ) {
        self.currentEdgeIndex++;
      }else {
        self.drawEdge(self.graph.edges[self.currentEdgeIndex++]);
      }
    }

    return self.currentEdgeIndex < c;
  }

  this.worker_drawNode = function() {
    var c = self.graph.nodes.length;
    var i = 0;
    while (i++< self.nodesSpeed && self.currentNodeIndex < c) {
      if (!self.isOnScreen(self.graph.nodes[self.currentNodeIndex])) {
        self.currentNodeIndex++;
      }else {
        self.drawNode(self.graph.nodes[self.currentNodeIndex++]);
      }
    }

    return self.currentNodeIndex < c;
  }
}

Plotter.prototype.drawEdge = function(edge) {
  var x1 = edge['source']['displayX'];
  var y1 = edge['source']['displayY'];
  var x2 = edge['target']['displayX'];
  var y2 = edge['target']['displayY'];

  this.ctx.globalCompositeOperation = 'destination-over';

  this.ctx.strokeStyle = edge['color'];
  this.ctx.lineWidth = edge['displaySize'];
  this.ctx.beginPath();
  this.ctx.moveTo(x1, y1);
  this.ctx.quadraticCurveTo((x1 + x2) / 2 + (y2 - y1) / 4,
                            (y1 + y2) / 2 + (x1 - x2) / 4,
                            x2,
                            y2);

  this.ctx.stroke();
};

Plotter.prototype.drawNode = function(node) {
  this.ctx.globalCompositeOperation = 'source-over';
  this.ctx.fillStyle = node['color'];
  this.ctx.beginPath();
  this.ctx.arc(node['displayX'],
               node['displayY'],
               node['displaySize'],
               0,
               Math.PI * 2,
               true);

  this.ctx.closePath();
  this.ctx.fill();
};

Plotter.prototype.isOnScreen = function(node) {
  if (isNaN(node['x']) || isNaN(node['y'])) {
    throw (new Error('A node\'s coordinate is not a number' +
                    '(id: ' + node['id'] + ')'));
  }

  return (node['displayX'] + node['displaySize'] > -this.width / 3) &&
    (node['displayX'] - node['displaySize'] < this.width * 4 / 3) &&
    (node['displayY'] + node['displaySize'] > -this.height / 3) &&
    (node['displayY'] - node['displaySize'] < this.height * 4 / 3);
};
