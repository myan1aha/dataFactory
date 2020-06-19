import { layoutGraph } from './layout';
import { addFlow, addClass, translateStr } from './utils';
import svgNavigate from './svgNavigate';

const contextURL = '';
var $ = function() {
  return {};
};

const svgns = 'http://www.w3.org/2000/svg';
function group(parent, id, settings, name) {
  var node = document.createElementNS(svgns, name || 'g');
  if (settings) {
    Object.keys(settings).forEach(k => {
      if (k === 'value') {
        node.appendChild(document.createTextNode(settings.value));
      } else {
        node.setAttribute(k, settings[k]);
      }
    });
  }
  parent.appendChild(node);
  return node;
}

function changeSvg(element, settings) {
  if (element) {
    Object.keys(settings).forEach(k => {
      element.setAttribute(k, settings[k]);
    });
  }
}

function polyline(parent, name, points, settings) {
  var ps = '';
  for (var i = 0; i < points.length; i++) {
    ps += points[i].join() + ' ';
  }
  return group(
    parent,
    '',
    {
      points: ps.trim(),
      ...(settings || {}),
    },
    'polyline',
  );
}

export default class SvgGraphView {
  xlinksn = 'http://www.w3.org/1999/xlink';

  constructor(ele) {
    this.graphMargin = 25;

    this.svgGraph = ele;
    this.svgNavi = new svgNavigate(ele);

    var gNode = document.createElementNS(svgns, 'g');
    gNode.setAttribute('class', 'main graph');
    this.svgGraph.appendChild(gNode);
    this.mainG = gNode;

    // this.edgeG = document.createElementNS(svgns, 'g');
    // this.mainG.appendChild(this.edgeG);

    this.tooltipcontainer = 'body';
  }
  render(data) {
    console.log('graph render');
    while (this.mainG.firstChild) { this.mainG.removeChild(this.mainG.firstChild); }
    addFlow(data);
    // console.log(data);
    this.graphBounds = this.renderGraph(data, this.mainG);
    this.resetPanZoom(400);
  }

  renderGraph(data, g) {
    g.data = data;
    var nodes = data.nodes;
    var edges = data.edges;
    var nodeMap = data.nodeMap;

    // Create a g node for edges, so that they're forced in the back.
    this.edgeG = document.createElementNS(svgns, 'g');
    this.mainG.appendChild(this.edgeG);

    var edgeG = this.edgeG;
    if (nodes.length == 0) {
      console.log('No results');
      return;
    }

    // Assign labels
    for (var i = 0; i < nodes.length; ++i) {
      nodes[i].label = nodes[i].id;
    }

    var self = this;
    for (var i = 0; i < nodes.length; ++i) {
      this.drawNode(this, nodes[i], g);
    }

    // layout
    layoutGraph(nodes, edges, 10);
    var bounds = this.calculateBounds(nodes);
    this.moveNodes(nodes);

    for (var i = 0; i < edges.length; ++i) {
      edges[i].toNode = nodeMap[edges[i].to];
      edges[i].fromNode = nodeMap[edges[i].from];
      this.drawEdge(this, edges[i], edgeG);
    }

    var margin = this.graphMargin;
    bounds.minX = bounds.minX ? bounds.minX - margin : -margin;
    bounds.minY = bounds.minY ? bounds.minY - margin : -margin;
    bounds.maxX = bounds.maxX ? bounds.maxX + margin : margin;
    bounds.maxY = bounds.maxY ? bounds.maxY + margin : margin;

    this.assignInitialStatus(this, data);

    return bounds;
  }

  drawNode(self, node, g) {
    if (node.type == 'flow') {
      this.drawFlowNode(self, node, g);
    } else {
      this.drawBoxNode(self, node, g);
    }
  }

  drawBoxNode(self, node, g) {
    var horizontalMargin = 8;
    var verticalMargin = 2;

    var nodeG = group(g, '', { class: 'node jobnode' });

    var innerG = group(nodeG, '', { class: 'nodebox' });

    var borderRect = group(
      innerG,
      '',
      { class: 'border', x: 0, y: 0, width: 10, height: 10, rx: 3, ry: 3 },
      'rect',
    );
    var jobNameText = group(innerG, '', { x: horizontalMargin, y: 16, value: node.label }, 'text');
    nodeG.innerG = innerG;
    innerG.borderRect = borderRect;

    var labelBBox = jobNameText.getBBox();
    var totalWidth = labelBBox.width + 2 * horizontalMargin;
    var totalHeight = labelBBox.height + 2 * verticalMargin;

    changeSvg(borderRect, { width: totalWidth, height: totalHeight });
    changeSvg(jobNameText, { y: (totalHeight + labelBBox.height) / 2 - 3 });
    changeSvg(innerG, { transform: translateStr(-totalWidth / 2, -totalHeight / 2) });

    node.width = totalWidth;
    node.height = totalHeight;

    node.gNode = nodeG;
    nodeG.data = node;
  }

  drawFlowNode(self, node, g) {

    // Base flow node
    var nodeG = group(g, '', { class: 'node flownode' });

    // Create all the elements
    var innerG = group(nodeG, '', { class: 'nodebox collapsed' });
    var borderRect = group(
      innerG,
      '',
      { class: 'flowborder', x: 0, y: 0, width: 10, height: 10, rx: 3, ry: 3 },
      'rect',
    );

    // Create label
    var labelG = group(innerG);
    var iconHeight = 20;
    var iconWidth = 21;
    var textOffset = iconWidth + 4;

    var jobNameText = group(labelG, '', { x: textOffset, y: 1, value: node.label }, 'text');
    var flowIdText = group(
      labelG,
      '',
      { x: textOffset, y: 11, value: node.flowId, 'font-size': 8 },
      'text',
    );

    var tempLabelG = labelG.getBBox();

    // Assign key values to make searching quicker
    node.gNode = nodeG;
    nodeG.data = node;

    // Do this because jquery svg selectors don't work
    nodeG.innerG = innerG;
    innerG.borderRect = borderRect;
    innerG.labelG = labelG;

    // Layout everything in the node
    this.layoutFlowNode(self, node);
  }

  calculateBounds(nodes) {
    var bounds = {};
    var node = nodes[0];
    bounds.minX = node.x - 10;
    bounds.minY = node.y - 10;
    bounds.maxX = node.x + 10;
    bounds.maxY = node.y + 10;

    for (var i = 0; i < nodes.length; ++i) {
      node = nodes[i];
      var centerX = node.width / 2;
      var centerY = node.height / 2;

      var minX = node.x - centerX;
      var minY = node.y - centerY;
      var maxX = node.x + centerX;
      var maxY = node.y + centerY;

      bounds.minX = Math.min(bounds.minX, minX);
      bounds.minY = Math.min(bounds.minY, minY);
      bounds.maxX = Math.max(bounds.maxX, maxX);
      bounds.maxY = Math.max(bounds.maxY, maxY);
    }
    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;

    return bounds;
  }

  moveNodes(nodes) {
    for (var i = 0; i < nodes.length; ++i) {
      var node = nodes[i];
      var gNode = node.gNode;

      changeSvg(gNode, { transform: translateStr(node.x, node.y) });
    }
  }

  drawEdge(self, edge, g) {

    var startNode = edge.fromNode;
    var endNode = edge.toNode;

    var startPointY = startNode.y + startNode.height / 2;
    var endPointY = endNode.y - endNode.height / 2;

    if (edge.guides) {
      // Create guide array
      var pointArray = new Array();
      pointArray.push([startNode.x, startPointY]);
      for (var i = 0; i < edge.guides.length; ++i) {
        var edgeGuidePoint = edge.guides[i];
        pointArray.push([edgeGuidePoint.x, edgeGuidePoint.y]);
      }
      pointArray.push([endNode.x, endPointY]);

      edge.line = polyline(g, pointArray, { class: 'edge', fill: 'none' });
      edge.line.data = edge;
      edge.oldpoints = pointArray;
    } else {
      edge.line = group(
        g,
        pointArray,
        { x1: startNode.x, y1: startPointY, x2: endNode.x, y2: endPointY, class: 'edge' },
        'line',
      );
      edge.line.data = edge;
    }
  }

  assignInitialStatus(evt, data) {
    for (var i = 0; i < data.nodes.length; ++i) {
      var updateNode = data.nodes[i];
      var g = updateNode.gNode;
      var initialStatus = updateNode.status ? updateNode.status : 'READY';

      addClass(g, initialStatus);
      var title = initialStatus + ' (' + updateNode.type + ')';

      if (updateNode.disabled) {
        addClass(g, 'nodeDisabled');
        title = 'DISABLED (' + updateNode.type + ')';
      }
      g.setAttribute('title',title);
    }
  }

  resetPanZoom(duration) {
    var bounds = this.graphBounds;
    var param = {
      x: bounds.minX,
      y: bounds.minY,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY,
      duration: duration,
    };

    this.panZoom(param);
  }

  panZoom(params) {
    params.maxScale = 2;
    this.svgNavi.transformToBox(params);
  }
}

// function transformToBox(params) {
//   var $this = $(this);
//   var target = $this[0];
//   var x = params.x;
//   var y = params.y;
//   var factor = 0.9;
//   var duration = params.duration;

//   var width = params.width ? params.width : 1;
//   var height = params.height ? params.height : 1;

//   var divHeight = target.parentNode.clientHeight;
//   var divWidth = target.parentNode.clientWidth;

//   var aspectRatioGraph = height / width;
//   var aspectRatioDiv = divHeight / divWidth;

//   var scale =
//     aspectRatioGraph > aspectRatioDiv ? (divHeight / height) * factor : (divWidth / width) * factor;

//   if (params.maxScale) {
//     if (scale > params.maxScale) {
//       scale = params.maxScale;
//     }
//   }
//   if (params.minScale) {
//     if (scale < params.minScale) {
//       scale = params.minScale;
//     }
//   }

//   // Center
//   var scaledWidth = width * scale;
//   var scaledHeight = height * scale;

//   var sx = (divWidth - scaledWidth) / 2 - scale * x;
//   var sy = (divHeight - scaledHeight) / 2 - scale * y;
//   console.log('sx,sy:' + sx + ',' + sy);

//   if (duration != 0 && !duration) {
//     duration = 500;
//   }

//   animateTransform(target, scale, sx, sy, duration);
// }
