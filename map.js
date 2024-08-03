var div = document.getElementById("mapframe");
var map = document.getElementById("map");
var dx = 0, dy = 0;
var first = 0;

//IMAGE PRELOADING
var photoarray = new Array("map-s.gif", "map-m.gif", "map-l.gif", "map-xl.gif");

var maparray = new Array();

for (var i = 0; i < photoarray.length; i++) {
    maparray[i] = new Image();
    maparray[i].src = photoarray[i];
} 

var currentmap = 0;


function pxout(x){
    return parseFloat(x)||0;
}

//RESIZE FUNCTION
function resize() {
    
    var height = window.innerHeight;
    var width = window.innerWidth;

    var divstyle = document.defaultView.getComputedStyle(div, "");
    
    var dx = pxout(divstyle.width);
    var dy = pxout(divstyle.height);

    div.style.height = (height - 60) + "px";
    // 100x2 margins + 150 form + 10x2 margins map + 10px margin form + 20px as space map-form
    div.style.width = (width - 400) + "px";

    newdx = pxout(divstyle.width);
    newdy = pxout(divstyle.height);

    if (first > 0){
        recenter(dx, newdx, dy, newdy);
    }

    dx = newdx;
    dy = newdy;
    first++;

}

//RECENTER FUNCTION
function recenter(dx, newdx, dy, newdy){
    var stylemap = document.defaultView.getComputedStyle(map, "");
    var left = pxout(stylemap.left);
    var top = pxout(stylemap.top);

    var incrementdx = dx - newdx;
    var incrementdy = dy - newdy;

    map.style.left = (left - incrementdx/2) + "px";
    map.style.top =(top -incrementdy/2) + "px";
}

////MOVE WITH CONTROLS FUNCTION
function moveright(){ 
    var stylemap = document.defaultView.getComputedStyle(map, "");
    var divstyle = document.defaultView.getComputedStyle(div, "");
    var divwidth = pxout(stylemap.left);
    map.style.left = (divwidth - (pxout(divstyle.width) / 2)) + "px";
}

function moveleft(){ 
    var stylemap = document.defaultView.getComputedStyle(map, "");
    var divstyle = document.defaultView.getComputedStyle(div, "");
    var divwidth = pxout(stylemap.left);
    map.style.left = (divwidth + (pxout(divstyle.width) / 2)) + "px";
}

function moveup(){ 
    var stylemap = document.defaultView.getComputedStyle(map, "");
    var divstyle = document.defaultView.getComputedStyle(div, "");
    var divheight = pxout(stylemap.top);
    map.style.top = (divheight + (pxout(divstyle.height) / 2)) + "px";
}

function movedown(){ 
    var stylemap = document.defaultView.getComputedStyle(map, "");
    var divstyle = document.defaultView.getComputedStyle(div, "");
    var divheight = pxout(stylemap.top);
    map.style.top = (divheight - (pxout(divstyle.height) / 2)) + "px";
}

//DOUBLE-CLICK FUNCTION
function doubleclick(event){
    let x = event.clientX;
    let y = event.clientY;

    var divstyle = document.defaultView.getComputedStyle(div, "");

    //margin values
    let centerx = 110 + (pxout(divstyle.width)/2);
    let centery = 30 + (pxout(divstyle.height)/2);

    let incrementx = x - centerx;
    let incrementy = y - centery;

    var mapleft = pxout(map.style.left);
    var maptop = pxout(map.style.top);

    map.style.left = (mapleft - incrementx) + "px";
    map.style.top = (maptop - incrementy) + "px";

}

//IINFORMATION RETRIEVAL FUNCTION
function indiv(x, y) {
    var divstyle = document.defaultView.getComputedStyle(div, "");
    var height = pxout(divstyle.height);
    var top = pxout(divstyle.top);
    var left = pxout(divstyle.left);
    var width = pxout(divstyle.width);

    return (x >= left && x <= left + width && y >= top && y <= top + height);
}

//DRAGGING FUNCTIONS
var isDragging = false;
var startx, starty, startleft, starttop;

function handleMouseDown(evt) {
	if (indiv(evt.clientX,evt.clientY)) {
		isDragging = true;
		evt.preventDefault();

        startx = evt.clientX;
        starty = evt.clientY;

        var mapstyle = document.defaultView.getComputedStyle(div, "");
        var map = document.getElementById("map");
        var mapstyle = document.defaultView.getComputedStyle(map, "");
        startleft = pxout(mapstyle.left);
        starttop = pxout(mapstyle.top);
        map.style.cursor = 'move';
        
	}
}

function handleMouseUp(evt) {
	if (isDragging) {
		evt.preventDefault();
        var map = document.getElementById("map");
        var deltax = evt.clientX - startx;
        var deltay = evt.clientY - starty;

        map.style.left = (startleft + deltax) + "px";
        map.style.top = (starttop + deltay) + "px";

		isDragging = false;	
        map.style.cursor = 'default';	
	}
}

function handleMouseMove(evt) {
	if (isDragging) {
		evt.preventDefault();
        var map = document.getElementById("map");
        var deltax = evt.clientX - startx;
        var deltay = evt.clientY - starty;

        map.style.left = (startleft + deltax) + "px";
        map.style.top = (starttop + deltay) + "px";
	}
}

//ZOOM-IN FUNCTION
function zoomin() {
    if (currentmap < maparray.length - 1) {
        var stylemap = document.defaultView.getComputedStyle(map, "");
        var divstyle = document.defaultView.getComputedStyle(div, "");
        var divwidth = pxout(divstyle.width);
        var divheight = pxout(divstyle.height);
        var mapwidth = pxout(stylemap.width);
        var mapheight = pxout(stylemap.height);
        var left = pxout(stylemap.left);
        var top = pxout(stylemap.top);

        var currentcenterx = -left + (divwidth / 2);
        var currentcentery = -top + (divheight / 2);

        currentmap = (currentmap + 1) % maparray.length;
        map.src = maparray[currentmap].src;

        var newstylemap = document.defaultView.getComputedStyle(map, "");
        var newmapwidth = pxout(newstylemap.width);
        var newmapheight = pxout(newstylemap.height);

        var newcenterx = (newmapwidth / mapwidth) * currentcenterx;
        var newcentery = (newmapheight / mapheight) * currentcentery;

        map.style.left = -newcenterx + (divwidth / 2) + "px";
        map.style.top = -newcentery + (divheight / 2) + "px";
    }
}

//ZOOM-OUT FUNCTION
function zoomout() {
    if (currentmap > 0) {
        var stylemap = document.defaultView.getComputedStyle(map, "");
        var divstyle = document.defaultView.getComputedStyle(div, "");
        var divwidth = pxout(divstyle.width);
        var divheight = pxout(divstyle.height);
        var mapwidth = pxout(stylemap.width);
        var mapheight = pxout(stylemap.height);
        var left = pxout(stylemap.left);
        var top = pxout(stylemap.top);

        var currentcenterx = -left + (divwidth / 2);
        var currentcentery = -top + (divheight / 2);

        currentmap = (currentmap - 1 + maparray.length) % maparray.length;
        map.src = maparray[currentmap].src;

        var newstylemap = document.defaultView.getComputedStyle(map, "");
        var newmapwidth = pxout(newstylemap.width);
        var newmapheight = pxout(newstylemap.height);

        var newcenterx = (newmapwidth / mapwidth) * currentcenterx;
        var newcentery = (newmapheight / mapheight) * currentcentery;

        map.style.left = -newcenterx + (divwidth / 2) + "px";
        map.style.top = -newcentery + (divheight / 2) + "px";
    }
}

resize();


document.getElementById("minus").addEventListener("click", zoomout);
document.getElementById("plus").addEventListener("click", zoomin);
document.addEventListener("mousedown",handleMouseDown,false);
document.addEventListener("mouseup",handleMouseUp,false);
document.addEventListener("mousemove",handleMouseMove,false);
document.getElementById("right").addEventListener("click", moveright);
document.getElementById("left").addEventListener("click", moveleft);
document.getElementById("up").addEventListener("click", moveup);
document.getElementById("down").addEventListener("click", movedown);
div.addEventListener("dblclick", doubleclick, false)
window.addEventListener("resize", resize, false);