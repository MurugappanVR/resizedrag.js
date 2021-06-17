let _loaded = false;
let _callbacks = [];
const _isTouch = window.ontouchstart !== undefined;
export const resizedrag = function(target, handler, onStart, onEnd) {
    let config = {
        dragEnabled : target.dataset.rdDragEnabled !== "false",
        resizeEnabled : target.dataset.rdResizeEnabled !== "false",
        dragBorderEnabled : target.dataset.rdDragBorderEnabled !== "false",
        rdDragBoundary : target.dataset.rdDragBoundary === "true",
        minWidth : target.dataset.rdMinWidth ? target.dataset.rdMinWidth : 5 ,
        minHeight : target.dataset.rdMinHeight ? target.dataset.rdMinHeight : 5
    }
    let MARGINS = 4;
    let edges = {
        top : false,
        bottom : false,
        left : false,
        right : false,
    }
    let targetElement = document.getElementById(target.id);
    let clickedInstance ;
    let eventHandlers  = {
        mousemove : function(e) {
            let c = e;
            if(e.touches) {
            c = e.touches[0];
            }
            // On mouse move, dispatch the coords to all registered callbacks.
            for (var i = 0; i < _callbacks.length; i++) {
                _callbacks[i](c.clientX, c.clientY);
            }
        },
        mousedown : function(e) {
            e.stopPropagation();
            e.preventDefault();
            if (!config.dragEnabled && !config.resizeEnabled) {
                return;
            }

            let c = e;
            if (e.touches) {
                c = e.touches[0];
            }
            isMoving = true;
            let bObj = attachResizeDragCursorStyle(c.clientX,c.clientY);
            clickedInstance = {
                cx : c.clientX,
                cy : c.clientY,
                w: bObj.b.width,
                h: bObj.b.height
            }
            isResizing = edges.right || edges.bottom || edges.top || edges.left;
            if(!isResizing){
                target.style["border-style"]="dashed";
                target.style["border-color"]="grey";
                target.style["border-width"]="2px";
            }
            startX = target.offsetLeft - c.clientX;
            startY = target.offsetTop - c.clientY;
        },
        mouseup : function(e) {
            if (onEnd && hasStarted) {
                onEnd(target, parseInt(target.style.left), parseInt(target.style.top));
            }
            let c = e;
            attachResizeDragCursorStyle(c.clientX,c.clientY);
            isResizing = false;
            isMoving = false;
            hasStarted = false;
            target.style["border"]="none";
        }
    }
  // Register a global event to capture mouse moves (once).
  if (!_loaded) {
    document.addEventListener(_isTouch ? "touchmove" : "mousemove", eventHandlers.mousemove);
  }

  _loaded = true;
  let isMoving = false, hasStarted = false, isResizing = false;
  let startX = 0, startY = 0, lastX = 0, lastY = 0;

  // On the first click and hold, record the offset of the pointer in relation
  // to the point of click inside the element.
  handler.addEventListener(_isTouch ? "touchstart" : "mousedown", eventHandlers.mousedown);

  // On leaving click, stop moving.
  document.addEventListener(_isTouch ? "touchend" : "mouseup", eventHandlers.mouseup);

  // Register mouse-move callback to move the element.
  _callbacks.push(function move(x, y) {
    if(targetElement && !isResizing){
        attachResizeDragCursorStyle(x,y);
    }
    if (!isMoving) {
      return;
    }
    
    if (!hasStarted) {
      hasStarted = true;
      if (onStart) {
        onStart(target, lastX, lastY);
      }
    }

    lastX = x + startX;
    lastY = y + startY;
    // If boundary checking is on, don't let the element cross the viewport.
    if (config.rdDragBoundary) {
      if (lastX < 1 || lastX >= window.innerWidth - target.offsetWidth) {
        return;
      }
      if (lastY < 1 || lastY >= window.innerHeight - target.offsetHeight) {
        return;
      }
    }
    if(isMoving){
        if(!isResizing && config.dragEnabled){
            target.style.left = lastX + "px";
            target.style.top = lastY + "px";
        }else{
            if(config.resizeEnabled){
                let b = target.getBoundingClientRect();
                let bx = x - b.left;
                let by = y - b.top;
                if (edges.right) {
                    target.style.width = Math.max(bx, config.minWidth) + 'px';
                }
                if (edges.bottom) {
                    target.style.height = Math.max(by, config.minHeight) + 'px';
                }
                if (edges.left) {
                    var currentWidth = Math.max(clickedInstance.cx - x  + clickedInstance.w, config.minWidth);
                    if (currentWidth > config.minWidth) {
                        target.style.width = currentWidth + 'px';
                        target.style.left = x + 'px';	
                    }
                }
                if (edges.top) {
                    var currentHeight = Math.max(clickedInstance.cy - y  + clickedInstance.h, config.minHeight);
                    if (currentHeight > config.minHeight) {
                        targetElement.style.height = currentHeight + 'px';
                        targetElement.style.top = y + 'px';
                    }
                }
            }
        }
    }
  });

  let attachResizeDragCursorStyle = function(x,y){
    let b = target.getBoundingClientRect();
    let eX = x - b.left;
    let eY = y - b.top;
    edges.top = eY < MARGINS;
    edges.left = eX < MARGINS;
    edges.right = eX >= b.width - MARGINS;
    edges.bottom = eY >= b.height - MARGINS;
    
    if (edges.right && edges.bottom || edges.left && edges.top) {
        targetElement.style.cursor = 'nwse-resize';
    } else if (edges.right && edges.top || edges.bottom && edges.left) {
        targetElement.style.cursor = 'nesw-resize';
    } else if (edges.right || edges.left) {
        targetElement.style.cursor = 'ew-resize';
    } else if (edges.bottom || edges.top) {
        targetElement.style.cursor = 'ns-resize';
    } else if(eX > 0 && eX < b.width && eY > 0 && eY < b.height){
        targetElement.style.cursor = config.dragEnabled  ?'move':'not-allowed';
    }else {
        targetElement.style.cursor = 'default';
    }
    let boundaryObj = {
        b:b, bX : eX, bY : eY
    }
    return boundaryObj
  }

}

export { resizedrag as default };
