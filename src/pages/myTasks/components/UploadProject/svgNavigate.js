function getPosition(target) {
  if (!target) {
    return;
  }

  var offsetParent,
    offset,
    parentOffset = { top: 0, left: 0 };

  if (getComputedStyle(target).style.position === 'fixed') {
    offset = target.getBoundingClientRect();
  } else {
    offsetParent = target.offsetParent;
    offset = target.offset;
    // if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
    //     parentOffset = offsetParent.offset();
    // }

    // parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
    // parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
  }

  return {
    top: offset.top - parentOffset.top,
    left: offset.left - parentOffset.left,
  };
}

var mouseUp = function(evt) {
  if (evt.button > 1) {
    return;
  }
  var target = evt.target;
  target.mx = evt.clientX;
  target.my = evt.clientY;
  target.mDown = false;
};
var mouseDown = function(evt) {
  if (evt.button > 1) {
    return;
  }

  var target = evt.target;
  target.mx = evt.clientX;
  target.my = evt.clientY;
  target.mDown = true;
};
var mouseOut = function(evt) {
  var target = evt.target;
  target.mx = evt.clientX;
  target.my = evt.clientY;
  target.mDown = false;
};

var mouseMove = function(evt) {
  var target = evt.target;
  if (target.mDown) {
    var dx = evt.clientX - target.mx;
    var dy = evt.clientY - target.my;

    evt.dragX = dx;
    evt.dragY = dy;
    mouseDrag(evt);
  }

  target.mx = evt.clientX;
  target.my = evt.clientY;
};

var mouseDrag = function(evt) {
  translateDeltaGraph(evt.target, evt.dragX, evt.dragY);
};

var mouseScrolled = function(evt) {
  if (!evt) {
    evt = window.event;
  }
  var target = evt.currentTarget;

  var leftOffset = 0;
  var topOffset = 0;
  console.log(target)
  // if (!target.marker) {
  //   while (!target.farthestViewportElement) {
  //     target = target.parentNode;
  //   }

  //   target = target.farthestViewportElement;
  // }

  // Trackball/trackpad vs wheel. Need to accommodate
  var delta = 0;
  if (evt.deltaY) {
    if (evt.deltaY > 0) {
      delta = Math.ceil(evt.deltaY / 120);
    } else {
      delta = Math.floor(evt.deltaY / 120);
    }
  } else if (evt.detail) {
    if (evt.detail > 0) {
      delta = -Math.ceil(evt.detail / 3);
    } else {
      delta = -Math.floor(evt.detail / 3);
    }
  }

  var zoomLevel = boundZoomLevel(target, target.zoomIndex + delta);
  target.zoomIndex = zoomLevel;
  var scale = target.zoomLevels[zoomLevel];

  var x = evt.offsetX;
  var y = evt.offsetY;
  if (!x) {
    var position = getPosition(target.parentElement);
    x = evt.layerX - position.left;
    y = evt.layerY - position.top;
  }

  evt.stopPropagation();
  evt.preventDefault();

  scaleGraph(target, scale, x, y);
};

var scaleGraph = function(target, scale, x, y) {
  var sfactor = scale / target.scale;
  target.scale = scale;

  target.translateX = sfactor * target.translateX + x - sfactor * x;
  target.translateY = sfactor * target.translateY + y - sfactor * y;

  if (target.model) {
    target.model.trigger('scaled');
  }
  retransform(target);
};

var retransform = function(target) {
  var gs = target.childNodes;

  var transformString =
    'translate(' + target.translateX + ',' + target.translateY + ') scale(' + target.scale + ')';

  for (var i = 0; i < gs.length; ++i) {
    var g = gs[i];
    if (g.nodeName == 'g') {
      g.setAttribute('transform', transformString);
    }
  }

  if (target.model) {
    var obj = target.model.get('transform');
    if (obj) {
      obj.scale = target.scale;
      obj.height = target.parentNode.clientHeight;
      obj.width = target.parentNode.clientWidth;

      obj.x1 = target.translateX;
      obj.y1 = target.translateY;
      obj.x2 = obj.x1 + obj.width * obj.scale;
      obj.y2 = obj.y1 + obj.height * obj.scale;
    }
  }
};

var boundZoomLevel = function(target, level) {
  if (level >= target.settings.zoomNumLevels) {
    return target.settings.zoomNumLevels - 1;
  } else if (level <= 0) {
    return 0;
  }

  return level;
};

var translateDeltaGraph = function(target, x, y) {
  target.translateX += x;
  target.translateY += y;
  if (target.model) {
    target.model.trigger('panned');
  }
  retransform(target);
};

var resetTransform = function(target) {
  console.log(target)
  var settings = target.settings;
  target.translateX = settings.x;
  target.translateY = settings.y;

  if (settings.x < settings.x2) {
    var factor = 0.9;

    // Reset scale and stuff.
    var divHeight = target.parentNode.clientHeight;
    var divWidth = target.parentNode.clientWidth;

    var width = settings.x2 - settings.x;
    var height = settings.y2 - settings.y;
    var aspectRatioGraph = height / width;
    var aspectRatioDiv = divHeight / divWidth;

    var scale =
      aspectRatioGraph > aspectRatioDiv
        ? (divHeight / height) * factor
        : (divWidth / width) * factor;
    target.scale = scale;
  } else {
    target.zoomIndex = boundZoomLevel(target, settings.zoomIndex);
    target.scale = target.zoomLevels[target.zoomIndex];
  }
};

var calculateZoomScale = function(scaleLevel, numLevels, points) {
  if (scaleLevel <= 0) {
    return points[0];
  } else if (scaleLevel >= numLevels) {
    return points[points.length - 1];
  }
  var factor = (scaleLevel / numLevels) * (points.length - 1);
  var floorIdx = Math.floor(factor);
  var ceilingIdx = Math.ceil(factor);

  var b = factor - floorIdx;

  return b * (points[ceilingIdx] - points[floorIdx]) + points[floorIdx];
};

var calculateZoomLevel = function(scale, zoomLevels) {
  if (scale >= zoomLevels[zoomLevels.length - 1]) {
    return zoomLevels.length - 1;
  } else if (scale <= zoomLevels[0]) {
    return 0;
  }

  var i = 0;
  // Plain old linear scan
  for (; i < zoomLevels.length; ++i) {
    if (scale < zoomLevels[i]) {
      i--;
      break;
    }
  }

  if (i < 0) {
    return 0;
  }

  return i;
};

export default class navi {
  settings = {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    minX: -1000,
    minY: -1000,
    maxX: 1000,
    maxY: 1000,
    zoomIndex: 24,
    zoomPoints: [0.1, 0.14, 0.2, 0.4, 0.8, 1, 1.6, 2.4, 4, 8, 16],
    zoomNumLevels: 48,
  };
  marker = true;

  constructor(ele) {
    // if (window.addEventListener) {
    //   document.addEventListener('wheel', mouseScrolled, false);
    // }
    this.target = ele;
    this.target.settings = this.settings;

    ele.addEventListener('mousewheel', mouseScrolled);
    ele.addEventListener('mousedown', mouseDown);
    ele.addEventListener('mouseup', mouseUp);
    ele.addEventListener('mousemove', mouseMove);
    ele.addEventListener('mouseout', mouseOut);
    this.zoomLevels = new Array(this.settings.zoomNumLevels);
    for (var i = 0; i < this.settings.zoomNumLevels; ++i) {
      var scale = calculateZoomScale(i, this.settings.zoomNumLevels, this.settings.zoomPoints);
      this.zoomLevels[i] = scale;
    }
    this.target.zoomLevels = this.zoomLevels;
    resetTransform(this.target);

  }
  transformToBox(params) {
    var target = this.target;
    var x = params.x;
    var y = params.y;
    var factor = 0.9;
    var duration = params.duration;

    var width = params.width ? params.width : 1;
    var height = params.height ? params.height : 1;

    var divHeight = target.parentNode.clientHeight;
    var divWidth = target.parentNode.clientWidth;

    var aspectRatioGraph = height / width;
    var aspectRatioDiv = divHeight / divWidth;

    var scale =
      aspectRatioGraph > aspectRatioDiv
        ? (divHeight / height) * factor
        : (divWidth / width) * factor;

    if (params.maxScale) {
      if (scale > params.maxScale) {
        scale = params.maxScale;
      }
    }
    if (params.minScale) {
      if (scale < params.minScale) {
        scale = params.minScale;
      }
    }

    // Center
    var scaledWidth = width * scale;
    var scaledHeight = height * scale;

    var sx = (divWidth - scaledWidth) / 2 - scale * x;
    var sy = (divHeight - scaledHeight) / 2 - scale * y;
    console.log('sx,sy:' + sx + ',' + sy);

    if (duration != 0 && !duration) {
      duration = 500;
    }

    animateTransform(this.target, scale, sx, sy, duration);
  }
  attachNavigateModel() {
    var target = this;
    target.model = arguments;

    if (target.model) {
      var obj = {};
      obj.scale = target.scale;
      obj.height = target.parentNode.clientHeight;
      obj.width = target.parentNode.clientWidth;

      obj.x1 = target.translateX;
      obj.y1 = target.translateY;
      obj.x2 = obj.x1 + obj.height * obj.scale;
      obj.y2 = obj.y1 + obj.width * obj.scale;

      target.model.set({
        transform: obj,
      });
    }
  }
}

var animateTransform = function(target, scale, x, y, duration) {
  var zoomLevel = calculateZoomLevel(scale, target.zoomLevels);
  target.fromScaleLevel = target.zoomIndex;
  target.toScaleLevel = zoomLevel;
  target.fromX = target.translateX;
  target.fromY = target.translateY;
  target.fromScale = target.scale;
  target.toScale = target.zoomLevels[zoomLevel];
  target.toX = x;
  target.toY = y;
  target.startTime = new Date().getTime();
  target.endTime = target.startTime + duration;

  animateTick(target);
};

var animateTick = function(target) {
  var time = new Date().getTime();
  if (time < target.endTime) {
    var timeDiff = time - target.startTime;
    var progress = timeDiff / (target.endTime - target.startTime);

    target.scale = (target.toScale - target.fromScale) * progress + target.fromScale;
    target.translateX = (target.toX - target.fromX) * progress + target.fromX;
    target.translateY = (target.toY - target.fromY) * progress + target.fromY;
    retransform(target);
    setTimeout(function() {
      animateTick(target);
    }, 1);
  } else {
    target.zoomIndex = target.toScaleLevel;
    target.scale = target.zoomLevels[target.zoomIndex];
    target.translateX = target.toX;
    target.translateY = target.toY;
    retransform(target);
  }
};
