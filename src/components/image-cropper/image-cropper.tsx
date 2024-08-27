import { Component, Event, EventEmitter, Fragment, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { DetectedQuadResultItem, NormalizedImageResultItem } from 'dynamsoft-document-normalizer';
import { CaptureVisionRouter } from 'dynamsoft-capture-vision-router';
import { CapturedResult } from 'dynamsoft-core';

export interface DetectedQuadResult{
  location: Quad;
  confidenceAsDocumentBoundary: number;
}

export interface Quad{
  points:[Point,Point,Point,Point];
}

export interface Point{
  x:number;
  y:number;
}

export interface Rect{
  x:number;
  y:number;
  width:number;
  height:number;
}

export interface CropOptions {
  perspectiveTransform?:boolean;
  colorMode?:"binary"|"gray"|"color";
  selection?:Quad|Rect;
  source?:Blob|string|HTMLImageElement|HTMLCanvasElement;
}

interface TouchDataStore {
  scale?:number;
  originalScale?:number;
  point1?:Point;
  point2?:Point;
  moveable?:boolean;
}

@Component({
  tag: 'image-cropper',
  styleUrl: 'image-cropper.css',
  shadow: true,
})
export class ImageCropper {
  handlers:number[] = [0,1,2,3,4,5,6,7];
  polygonMouseDown:boolean = false;
  polygonMouseDownPoint:Point = {x:0,y:0};
  touchDataStore:TouchDataStore|undefined = undefined;
  svgMouseDownPoint:Point|undefined = undefined;
  handlerMouseDownPoint:Point = {x:0,y:0};
  root:HTMLElement;
  containerElement:HTMLElement;
  svgElement:SVGElement;
  imgElement:SVGImageElement;
  canvasElement:HTMLCanvasElement;
  originalPoints:[Point,Point,Point,Point] = undefined;
  cvr:CaptureVisionRouter|undefined;
  usingTouchEvent:boolean = false;
  usingQuad = false;
  previousTouchedTime = 0;
  scaledAfterDoubleTap = false;
  @Prop() img?: HTMLImageElement;
  @Prop() rect?: Rect;
  @Prop() quad?: Quad;
  @Prop() license?: string;
  @Prop() hidefooter?: string;
  @Prop() handlersize?: string;
  @Prop() inactiveSelections?: (Quad|Rect)[];
  @Prop() draggingmode?: "x-only"|"y-only";
  @State() viewBox:string = "0 0 1280 720";
  @State() activeStroke:number = 2;
  @State() inActiveStroke:number = 4;
  @State() selectedHandlerIndex:number = -1;
  @State() points:[Point,Point,Point,Point] = undefined;
  @State() offsetX = 0;
  @State() offsetY = 0;
  @State() scale = 1.0;
  @Event() confirmed?: EventEmitter<void>;
  @Event() canceled?: EventEmitter<void>;
  @Event() selectionClicked?: EventEmitter<number>;
  @Event() imageLoaded?: EventEmitter<void>;
  componentDidLoad(){
    this.containerElement.addEventListener("touchmove", (e:TouchEvent) => {
      this.onContainerTouchMove(e);
    })
    this.containerElement.addEventListener("touchstart", (e:TouchEvent) => {
      this.onContainerTouchStart(e);
    })
    this.containerElement.addEventListener("touchend", () => {
      this.onContainerTouchEnd();
    })
  }

  @Watch('img')
  watchImgPropHandler(newValue: HTMLImageElement) {
    if (newValue) {
      this.resetStates();
      this.viewBox = "0 0 "+newValue.naturalWidth+" "+newValue.naturalHeight;
      if (this.root) {
        const inActiveStroke = parseInt(this.root.style.getPropertyValue("--inactive-stroke"));
        const activeStroke = parseInt(this.root.style.getPropertyValue("--active-stroke"));
        if (inActiveStroke){
          this.inActiveStroke = inActiveStroke;
        }
        if (activeStroke){
          this.activeStroke = activeStroke;
        }
      }
    }
  }

  @Watch('rect')
  watchRectPropHandler(newValue: Rect) {
    if (newValue) {
      this.usingQuad = false;
      let points = this.getPointsFromRect(newValue);
      if (this.img) {
        this.restrainPointsInBounds(points,this.img.naturalWidth,this.img.naturalHeight);
      }
      this.points = points;
    }
  }

  getPointsFromRect(rect:Rect):[Point,Point,Point,Point]{
    const point1:Point = {x:rect.x,y:rect.y};
    const point2:Point = {x:rect.x+rect.width,y:rect.y};
    const point3:Point = {x:rect.x+rect.width,y:rect.y+rect.height};
    const point4:Point = {x:rect.x,y:rect.y+rect.height};
    return [point1,point2,point3,point4];
  }

  @Watch('quad')
  watchQuadPropHandler(newValue: Quad) {
    if (newValue) {
      this.usingQuad = true;
      let points = newValue.points;
      if (this.img) {
        this.restrainPointsInBounds(points,this.img.naturalWidth,this.img.naturalHeight);
      }
      this.points = newValue.points;
    }
  }

  onCanceled(){
    if (this.canceled){
      this.canceled.emit();
    }
  }

  onConfirmed(){
    if (this.confirmed){
      this.confirmed.emit();
    }
  }

  getPointsData(){
    if (this.points) {
      let pointsData = this.points[0].x + "," + this.points[0].y + " ";
      pointsData = pointsData + this.points[1].x + "," + this.points[1].y +" ";
      pointsData = pointsData + this.points[2].x + "," + this.points[2].y +" ";
      pointsData = pointsData + this.points[3].x + "," + this.points[3].y;
      return pointsData;
    }
    return "";
  }

  renderFooter(){
    if (this.hidefooter === "") {
      return "";
    }
    return (
      <div class="footer">
        <section class="items">
          <div class="item accept-cancel" onClick={() => this.onCanceled()}>
            <img src="data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%23727A87' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_5_'%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M394.2,142L370,117.8c-1.6-1.6-4.1-1.6-5.7,0L258.8,223.4c-1.6,1.6-4.1,1.6-5.7,0L147.6,117.8 c-1.6-1.6-4.1-1.6-5.7,0L117.8,142c-1.6,1.6-1.6,4.1,0,5.7l105.5,105.5c1.6,1.6,1.6,4.1,0,5.7L117.8,364.4c-1.6,1.6-1.6,4.1,0,5.7 l24.1,24.1c1.6,1.6,4.1,1.6,5.7,0l105.5-105.5c1.6-1.6,4.1-1.6,5.7,0l105.5,105.5c1.6,1.6,4.1,1.6,5.7,0l24.1-24.1 c1.6-1.6,1.6-4.1,0-5.7L288.6,258.8c-1.6-1.6-1.6-4.1,0-5.7l105.5-105.5C395.7,146.1,395.7,143.5,394.2,142z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E" />
          </div>
          <div class="item accept-use" onClick={() => this.onConfirmed()}>
            <img src="data:image/svg+xml,%3Csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 512 512' enable-background='new 0 0 512 512' xml:space='preserve'%3E%3Ccircle fill='%232CD865' cx='256' cy='256' r='256'/%3E%3Cg id='Icon_1_'%3E%3Cg%3E%3Cg%3E%3Cpath fill='%23FFFFFF' d='M208,301.4l-55.4-55.5c-1.5-1.5-4-1.6-5.6-0.1l-23.4,22.3c-1.6,1.6-1.7,4.1-0.1,5.7l81.6,81.4 c3.1,3.1,8.2,3.1,11.3,0l171.8-171.7c1.6-1.6,1.6-4.2-0.1-5.7l-23.4-22.3c-1.6-1.5-4.1-1.5-5.6,0.1L213.7,301.4 C212.1,303,209.6,303,208,301.4z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E" />
          </div>
        </section>
      </div>
    )
  }

  rendenInactiveSelections(){
    if (!this.inactiveSelections) {
      return "";
    }
    return (
      <Fragment>
        {this.inactiveSelections.map((selection,index) => (
          <polygon
            points={this.getPointsDataFromSelection(selection)}
            class="inactive-selection dashed"
            stroke-width={this.inActiveStroke * this.getRatio()}
            fill="transparent"
            onMouseUp={()=>this.onSelectionClicked(index)}
            onTouchStart={()=>this.onSelectionClicked(index)}
          >
         </polygon>
        ))}
      </Fragment>
    );
  }

  onSelectionClicked(index:number) {
    if (this.selectionClicked) {
      this.selectionClicked.emit(index);
    }
  }

  getPointsDataFromSelection(selection:Quad|Rect){
    let points:Point[] = [];
    if ("width" in selection) { //is Rect
      points = this.getPointsFromRect(selection);
    }else{
      points = selection.points;
    }
    let pointsData = points[0].x + "," + points[0].y + " ";
    pointsData = pointsData + points[1].x + "," + points[1].y +" ";
    pointsData = pointsData + points[2].x + "," + points[2].y +" ";
    pointsData = pointsData + points[3].x + "," + points[3].y;
    return pointsData;
  }

  renderHandlers(){
    if (!this.points) {
      return (<div></div>)
    }
    return (
      <Fragment>
        {this.handlers.map(index => (
          <rect 
            x={this.getHandlerPos(index,"x")} 
            y={this.getHandlerPos(index,"y")} 
            width={this.getHandlerSize()}
            height={this.getHandlerSize()} 
            class="cropper-controls"
            stroke-width={index === this.selectedHandlerIndex ? this.activeStroke * 2 * this.getRatio() : this.activeStroke * this.getRatio()}
            fill="transparent"
            onMouseDown={(e:MouseEvent)=>this.onHandlerMouseDown(e,index)}
            onMouseUp={(e:MouseEvent)=>this.onHandlerMouseUp(e)}
            onTouchStart={(e:TouchEvent)=>this.onHandlerTouchStart(e,index)}
            onPointerDown={(e:PointerEvent)=>this.onHandlerPointerDown(e,index)}
          />
        ))}
      </Fragment>
    )
  }

  getHandlerPos(index:number,key:string) {
    let pos = 0;
    let size = this.getHandlerSize();
    if (index === 0){
      pos = this.points[0][key];
    }else if (index === 1) {
      pos = this.points[0][key] + (this.points[1][key] - this.points[0][key])/2;
    }else if (index === 2) {
      pos = this.points[1][key];
    }else if (index === 3) {
      pos = this.points[1][key] + (this.points[2][key] - this.points[1][key])/2;
    }else if (index === 4) {
      pos = this.points[2][key];
    }else if (index === 5) {
      pos = this.points[3][key] + (this.points[2][key] - this.points[3][key])/2;
    }else if (index === 6) {
      pos = this.points[3][key];
    }else if (index === 7) {
      pos = this.points[0][key] + (this.points[3][key] - this.points[0][key])/2;
    }
    pos = pos - size/2;
    return pos;
  }

  getHandlerSize() {
    let ratio = this.getRatio();
    let size:number = 20;
    if (this.handlersize) {
      try {
        size = parseInt(this.handlersize);
      } catch (error) {
        console.log(error);
      }
    }
    return Math.ceil(size*ratio);
  }

  onSVGTouchStart(e:TouchEvent) {
    this.usingTouchEvent = true;
    this.svgMouseDownPoint = undefined;
    this.checkDoubleTap(e);
    let coord = this.getMousePosition(e,this.svgElement);
    if (e.touches.length > 1) {
      this.selectedHandlerIndex = -1;
    }else{
      if (this.selectedHandlerIndex != -1) {
        this.originalPoints = JSON.parse(JSON.stringify(this.points));  //We need this info so that whether we start dragging the rectangular in the center or in the corner will not affect the result.
        this.handlerMouseDownPoint.x = coord.x;
        this.handlerMouseDownPoint.y = coord.y;
      }else{
        this.svgMouseDownPoint = {x:coord.x,y:coord.y};
      }
    }
  }

  onSVGTouchEnd() {
    this.svgMouseDownPoint = undefined;
  }

  onSVGTouchMove(e:TouchEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (e.touches.length === 2) {
      this.pinchAndZoom(e);
    }else{
      if (this.svgMouseDownPoint) {
        this.panSVG(e);
      }else{
        this.handleMoveEvent(e);
      }
    }
  }

  //handle pinch and zoom
  pinchAndZoom(e:TouchEvent){
    if (!this.touchDataStore) {
      return;
    }
    if (!this.touchDataStore.moveable) {
      return;
    }
    if (!this.touchDataStore.point2) {
      this.touchDataStore.point2 = {x:e.touches[1].clientX,y:e.touches[1].clientY}
    }

    const getDistance = (start:Point, stop:Point) => {
      return Math.hypot(stop.x - start.x, stop.y - start.y);
    };

    let zoom = getDistance({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }, {
      x: e.touches[1].clientX,
      y: e.touches[1].clientY
    }) /
    getDistance({
      x: this.touchDataStore.point1.x,
      y: this.touchDataStore.point1.y
    }, {
      x: this.touchDataStore.point2.x,
      y: this.touchDataStore.point2.y
    });
    let newScale = this.touchDataStore.originalScale * zoom;
    this.scale = newScale;
  }

  onContainerMouseUp(){
    this.svgMouseDownPoint = undefined;
    if (!this.usingTouchEvent) {
      this.selectedHandlerIndex = -1;
      this.polygonMouseDown = false;
    }
  }

  onSVGMouseDown(e:MouseEvent) {
    if (!this.usingTouchEvent) {
      let coord = this.getMousePosition(e,this.svgElement);
      this.svgMouseDownPoint = {x:coord.x,y:coord.y};
    }
  }

  onContainerWheel(e:WheelEvent) {
    if (e.deltaY<0) {
      this.scale = this.scale + 0.1;
    }else{
      this.scale = Math.max(0.1, this.scale - 0.1);
    } 
    e.preventDefault();
  }
  
  onContainerTouchStart(e:TouchEvent) {
    this.initTouchDataStore(e);
  }

  initTouchDataStore(e:TouchEvent){
    let touch1 = e.touches[0];
    let touch2 = e.touches[1];
    let point1:Point = {x:touch1.clientX,y:touch1.clientY};
    let point2:Point;
    if (touch2) {
      point2 = {x:touch2.clientX,y:touch2.clientY};
    }
    this.touchDataStore = {
      point1:point1,
      point2:point2,
      moveable:true,
      originalScale:this.scale
    }
  }

  onContainerTouchEnd() {
    this.polygonMouseDown = false;
    if (this.touchDataStore) {
      this.touchDataStore.moveable = false;
      this.touchDataStore.point2 = undefined;
    }
  }

  onContainerTouchMove(e:TouchEvent) {
    e.preventDefault();
    if (e.touches.length === 2) {
      this.pinchAndZoom(e);
    }
  }

  getPanAndZoomStyle(){
    if (this.img) {
      const percentX = this.offsetX / this.img.naturalWidth * 100; 
      const percentY = this.offsetY / this.img.naturalHeight * 100;
      //return `matrix( ${this.scale}, 0, 0, ${this.scale}, ${percentX}, ${percentY} )`
      return "scale("+this.scale+") translateX("+percentX+"%)translateY("+percentY+"%)";
    }else{
      return "scale(1.0)";
    }
  }

  onSVGMouseMove(e:MouseEvent){
    if (this.svgMouseDownPoint) {
      this.panSVG(e);
    }else{
      this.handleMoveEvent(e);
    }
  }

  panSVG(e:TouchEvent|MouseEvent){
    let coord = this.getMousePosition(e,this.svgElement);
    let offsetX = coord.x - this.svgMouseDownPoint.x;
    let offsetY = coord.y - this.svgMouseDownPoint.y;
    //console.log("coord");
    //console.log(coord);
    //console.log("svgMouseDownPoint");
    //console.log(this.svgMouseDownPoint);
    //console.log("panSVG");
    //console.log(offsetX)
    //console.log(offsetY)

    //e.g img width: 100, offsetX: -10, translateX: -10%
    if (this.draggingmode) {
      if (this.draggingmode == "x-only") {
        this.offsetX = this.offsetX + offsetX;  
      }else if (this.draggingmode == "y-only") {
        this.offsetY = this.offsetY + offsetY;
      }
    }else{
      this.offsetX = this.offsetX + offsetX;
      this.offsetY = this.offsetY + offsetY;
    }
  }

  handleMoveEvent(e:MouseEvent|TouchEvent){
    if (this.polygonMouseDown) {
      let coord = this.getMousePosition(e,this.svgElement);
      let offsetX = coord.x - this.polygonMouseDownPoint.x;
      let offsetY = coord.y - this.polygonMouseDownPoint.y;
      let newPoints = JSON.parse(JSON.stringify(this.originalPoints));
      for (const point of newPoints) {
        point.x = point.x + offsetX;
        point.y = point.y + offsetY;
        if (point.x < 0 || point.y < 0 || point.x > this.img.naturalWidth || point.y > this.img.naturalHeight){
          console.log("reach bounds");
          return;
        }
      }
      this.points = newPoints;
    }
    if (this.selectedHandlerIndex >= 0) {
      let pointIndex = this.getPointIndexFromHandlerIndex(this.selectedHandlerIndex);
      let coord = this.getMousePosition(e,this.svgElement);
      let offsetX = coord.x - this.handlerMouseDownPoint.x;
      let offsetY = coord.y - this.handlerMouseDownPoint.y;
      let newPoints = JSON.parse(JSON.stringify(this.originalPoints));
      if (pointIndex != -1) {
        let selectedPoint = newPoints[pointIndex];
        selectedPoint.x = this.originalPoints[pointIndex].x + offsetX;
        selectedPoint.y = this.originalPoints[pointIndex].y + offsetY;
        if (this.usingQuad === false) { //rect mode
          if (pointIndex === 0) {
            newPoints[1].y = selectedPoint.y;
            newPoints[3].x = selectedPoint.x;
          }else if (pointIndex === 1) {
            newPoints[0].y = selectedPoint.y;
            newPoints[2].x = selectedPoint.x;
          }else if (pointIndex === 2) {
            newPoints[1].x = selectedPoint.x;
            newPoints[3].y = selectedPoint.y;
          }else if (pointIndex === 3) {
            newPoints[0].x = selectedPoint.x;
            newPoints[2].y = selectedPoint.y;
          }
        }
      }else{ //mid-point handlers
        if (this.selectedHandlerIndex === 1) {
          newPoints[0].y = this.originalPoints[0].y + offsetY;
          newPoints[1].y = this.originalPoints[1].y + offsetY;
        }else if (this.selectedHandlerIndex === 3) {
          newPoints[1].x = this.originalPoints[1].x + offsetX;
          newPoints[2].x = this.originalPoints[2].x + offsetX;
        }else if (this.selectedHandlerIndex === 5) {
          newPoints[2].y = this.originalPoints[2].y + offsetY;
          newPoints[3].y = this.originalPoints[3].y + offsetY;
        }else if (this.selectedHandlerIndex === 7) {
          newPoints[0].x = this.originalPoints[0].x + offsetX;
          newPoints[3].x = this.originalPoints[3].x + offsetX;
        }
      }
      if (this.img) {
        this.restrainPointsInBounds(newPoints,this.img.naturalWidth,this.img.naturalHeight);
      }
      this.points = newPoints;
    }
  }

  restrainPointsInBounds(points:[Point,Point,Point,Point],imgWidth:number,imgHeight:number){
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      point.x = Math.max(0,point.x);
      point.x = Math.min(point.x,imgWidth);
      point.y = Math.max(0,point.y);
      point.y = Math.min(point.y,imgHeight);
    }
  }

  checkDoubleTap(e:TouchEvent){
    if (e.touches.length === 1){
      let time = new Date().getTime();
      //double tap
      if ((time - this.previousTouchedTime) < 500) {
        if (this.selectedHandlerIndex != -1) {
          this.selectedHandlerIndex = -1;
        }else{
          if (this.scaledAfterDoubleTap) {
            this.scale = this.scale / 2;
          }else{
            this.scale = this.scale * 2;
          }
          this.scaledAfterDoubleTap = !this.scaledAfterDoubleTap;
        }
        this.previousTouchedTime = 0;
      }else {
        this.previousTouchedTime = time;
      }
    }
  }

  onPolygonMouseDown(e:MouseEvent){
    e.stopPropagation();
    this.originalPoints = JSON.parse(JSON.stringify(this.points));
    this.polygonMouseDown = true;
    let coord = this.getMousePosition(e,this.svgElement);
    this.polygonMouseDownPoint.x = coord.x;
    this.polygonMouseDownPoint.y = coord.y;
  }

  onPolygonMouseUp(e:MouseEvent){
    e.stopPropagation();
    if (!this.usingTouchEvent) {
      this.selectedHandlerIndex = -1;
      this.polygonMouseDown = false;
    }
  }

  onPolygonTouchStart(e:TouchEvent) {
    this.usingTouchEvent = true;
    e.stopPropagation();
    this.checkDoubleTap(e);
    this.selectedHandlerIndex = -1;
    this.polygonMouseDown = false;
    this.originalPoints = JSON.parse(JSON.stringify(this.points));
    this.polygonMouseDown = true;
    let coord = this.getMousePosition(e,this.svgElement);
    this.polygonMouseDownPoint.x = coord.x;
    this.polygonMouseDownPoint.y = coord.y;
    this.initTouchDataStore(e);
  }

  onPolygonTouchEnd(e:TouchEvent) {
    e.stopPropagation();
    this.selectedHandlerIndex = -1;
    this.polygonMouseDown = false;
  }

  onHandlerMouseDown(e:MouseEvent,index:number){
    e.stopPropagation();
    let coord = this.getMousePosition(e,this.svgElement);
    this.originalPoints = JSON.parse(JSON.stringify(this.points));
    this.handlerMouseDownPoint.x = coord.x;
    this.handlerMouseDownPoint.y = coord.y;
    this.selectedHandlerIndex = index;
  }

  onHandlerMouseUp(e:MouseEvent){
    e.stopPropagation();
    if (!this.usingTouchEvent) {
      this.selectedHandlerIndex = -1;
    }
  }

  onHandlerTouchStart(e:TouchEvent,index:number) {
    this.usingTouchEvent = true; //Touch events are triggered before mouse events. We can use this to prevent executing mouse events.
    e.stopPropagation();
    this.polygonMouseDown = false;
    let coord = this.getMousePosition(e,this.svgElement);
    this.originalPoints = JSON.parse(JSON.stringify(this.points));
    this.handlerMouseDownPoint.x = coord.x;
    this.handlerMouseDownPoint.y = coord.y;
    this.selectedHandlerIndex = index;
  }

  onHandlerPointerDown(e:PointerEvent,index:number) {
    if (e.pointerType != "mouse" && !this.usingTouchEvent) {
      this.onHandlerMouseDown(e,index);
      e.preventDefault();
    }
  }

  getPointIndexFromHandlerIndex(index:number){
    if (index === 0) {
      return 0;
    }else if (index === 2) {
      return 1;
    }else if (index === 4) {
      return 2;
    }else if (index === 6) {
      return 3;
    }
    return -1;
  }

  //Convert the screen coordinates to the SVG's coordinates from https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
  getMousePosition(event:any,svg:any) {
    let CTM = svg.getScreenCTM();
    let pos = {x:0,y:0};
    if (event.targetTouches) { //if it is a touch event
      let x = event.targetTouches[0].clientX;
      let y = event.targetTouches[0].clientY;
      pos = {
        x: (x - CTM.e) / CTM.a,
        y: (y - CTM.f) / CTM.d
      };
    }else{
      pos = {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
      };
    }
    if (this.isSafari() && this.scale != 1.0){
      pos.x = pos.x / this.scale;
      pos.y = pos.y / this.scale;
    }
    return pos;
  }
  
  isSafari(){
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  }

  getRatio(){
    if (this.img) {
      return this.img.naturalWidth/750;
    }else{
      return 1;
    }
  }

  @Method()
  async resetStates():Promise<void>
  {
    this.scale = 1.0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  @Method()
  async getAllSelections(convertTo?:"rect"|"quad"):Promise<(Quad|Rect)[]>
  {
    let all = [];
    for (let index = 0; index < this.inactiveSelections.length; index++) {
      let selection = this.inactiveSelections[index];
      if (convertTo) {
        if ("width" in selection && convertTo === "quad") {
          selection = {points:this.getPointsFromRect(selection)};
        }else if (!("width" in selection) && convertTo === "rect"){
          selection = this.getRectFromPoints(selection.points);
        }
      }
      all.push(selection);
    }
    let useQuad = true;
    if (convertTo) {
      if (convertTo === "rect") {
        useQuad = false;
      }
    }else{
      if (!this.usingQuad) {
        useQuad = false;
      }
    }
    if (useQuad) {
      const quad = await this.getQuad();
      all.push(quad);
    }else{
      const rect = await this.getRect();
      all.push(rect);
    }
    return all;
  }

  @Method()
  async getPoints():Promise<[Point,Point,Point,Point]>
  {
    return this.points;
  }

  @Method()
  async getQuad():Promise<Quad>
  {
    return {points:this.points};
  }

  @Method()
  async getRect():Promise<Rect>
  {
    return this.getRectFromPoints(this.points);
  }

  getRectFromPoints(points:Point[]):Rect{
    let minX:number;
    let minY:number;
    let maxX:number;
    let maxY:number;
    for (const point of points) {
      if (!minX) {
        minX = point.x;
        maxX = point.x;
        minY = point.y;
        maxY = point.y;
      }else{
        minX = Math.min(point.x,minX);
        minY = Math.min(point.y,minY);
        maxX = Math.max(point.x,maxX);
        maxY = Math.max(point.y,maxY);  
      }
    }
    minX = Math.floor(minX);
    maxX = Math.floor(maxX);
    minY = Math.floor(minY);
    maxY = Math.floor(maxY);
    return {x:minX,y:minY,width:maxX - minX,height:maxY - minY};
  }

  @Method()
  async getCroppedImage(options:CropOptions):Promise<string>
  {
    let img:Blob|string|HTMLImageElement|HTMLCanvasElement = this.img;
    if (options.source) {
      img = options.source;
    }
    let isQuad = false;
    if (options.selection) {
      if (!("width" in options.selection)) {
        isQuad = true;
      }
    }else{
      if (this.usingQuad) {
        isQuad = true;
      }
    }
    if (options.perspectiveTransform && window["Dynamsoft"] && isQuad) {
      if (!this.cvr) {
        await this.initCVR();
      }
      let templateName = "NormalizeDocument_Color";
      if (options.colorMode) {
        if (options.colorMode === "binary") {
          templateName = "NormalizeDocument_Binary";
        } else if (options.colorMode === "gray") {
          templateName = "NormalizeDocument_Gray";
        } else {
          templateName = "NormalizeDocument_Color";
        }
      }
      let quad:Quad;
      if (options.selection) {
        if ("width" in options.selection) {
          quad = {points:this.getPointsFromRect(options.selection)};
        }else{
          quad = options.selection;
        }
      }else{
        quad = await this.getQuad();
      }
      let settings = await this.cvr.getSimplifiedSettings(templateName);
      settings.roi  = quad;
      settings.roiMeasuredInPercentage = false;
      await this.cvr.updateSettings(templateName, settings);
      this.cvr.maxCvsSideLength = 99999;
      let normalizedImagesResult:CapturedResult = await this.cvr.capture(img,templateName,true);
      let normalizedImageResultItem:NormalizedImageResultItem = (normalizedImagesResult.items[0] as NormalizedImageResultItem);
      let dataURL = normalizedImageResultItem.toCanvas().toDataURL();
      return dataURL;
    }else{
      let ctx = this.canvasElement.getContext("2d");
      let rect:Rect;
      if (options.selection) {
        if ("width" in options.selection) {
          rect = options.selection;
        }else{
          rect = this.getRectFromPoints(options.selection.points);
        }
      }else{
        rect = await this.getRect();
      }
      if (typeof(img) === "string") {
        img = await this.getImageFromDataURL(img);
      }
      if (img instanceof Blob) {
        img = await this.getImageFromBlob(img);
      }
      this.canvasElement.width = rect.width;
      this.canvasElement.height = rect.height;
      ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
      return this.canvasElement.toDataURL();
    }
  }

  async getImageFromBlob(source:Blob){
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(source);
      reader.onloadend = function () {
        let dataURL:string = reader.result as string;
        let img = document.createElement("img");
        img.onload = function(){
          resolve(img);
        };
        img.onerror = function(){
          reject();
        }
        img.src = dataURL;
      }
    })
  }

  async getImageFromDataURL(source:string){
    return new Promise<HTMLImageElement>((resolve, reject) => {
      let img = document.createElement("img");
      img.onload = function(){
        resolve(img);
      };
      img.onerror = function(){
        reject();
      }
      img.src = source;
    })
  }

  @Method()
  async detect(source: string | HTMLImageElement | Blob | HTMLCanvasElement):Promise<DetectedQuadResult[]>
  {
    if (window["Dynamsoft"]) {
      if (!this.cvr) {
        await this.initCVR();
      }
      this.cvr.maxCvsSideLength = 99999;
      let result:CapturedResult = await this.cvr.capture(source,"DetectDocumentBoundaries_Default",true);
      let results:DetectedQuadResultItem[] = [];
      for (let index = 0; index < result.items.length; index++) {
        const item = (result.items[index] as DetectedQuadResultItem);
        results.push(item);
      }
      return results;
    }else{
      throw "Dynamsoft Document Normalizer not found";
    }
  }

  @Method()
  async fitWidth():Promise<void>
  {
    let svgWidth = this.svgElement.clientWidth;
    let parentWidth = this.svgElement.parentElement.clientWidth;
    let newScale = parentWidth / svgWidth;
    this.scale = newScale;
  }

  @Method()
  async fitWindow():Promise<void>
  {
    let svgHeight = this.svgElement.clientHeight;
    let parentHeight = this.svgElement.parentElement.clientHeight;
    let newScale = parentHeight / svgHeight;
    this.scale = newScale;
  }

  @Method()
  async fitActualSize():Promise<void>
  {
    let svgWidth = this.svgElement.clientWidth;
    let imgWidth = this.img.naturalWidth;
    let newScale = imgWidth / svgWidth * this.scale;
    this.scale = newScale;
  }

  @Method()
  async goToTop():Promise<void>
  {
    //console.log("go to top");
    let rect = this.imgElement.getBoundingClientRect();
    //console.log(rect);
    let scale = rect.width / this.img.naturalWidth
    this.offsetY = -rect.top / scale;
    //console.log(this.offsetY);
  }

  async initCVR(){
    window["Dynamsoft"]["License"]["LicenseManager"].initLicense(this.license);
    window["Dynamsoft"]["Core"]["CoreModule"].loadWasm(["DDN"]);
    this.cvr = await window["Dynamsoft"]["CVR"]["CaptureVisionRouter"].createInstance();
    await this.cvr.initSettings("{\"CaptureVisionTemplates\": [{\"Name\": \"Default\"},{\"Name\": \"DetectDocumentBoundaries_Default\",\"ImageROIProcessingNameArray\": [\"roi-detect-document-boundaries\"]},{\"Name\": \"DetectAndNormalizeDocument_Default\",\"ImageROIProcessingNameArray\": [\"roi-detect-and-normalize-document\"]},{\"Name\": \"NormalizeDocument_Binary\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-binary\"]},  {\"Name\": \"NormalizeDocument_Gray\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-gray\"]},  {\"Name\": \"NormalizeDocument_Color\",\"ImageROIProcessingNameArray\": [\"roi-normalize-document-color\"]}],\"TargetROIDefOptions\": [{\"Name\": \"roi-detect-document-boundaries\",\"TaskSettingNameArray\": [\"task-detect-document-boundaries\"]},{\"Name\": \"roi-detect-and-normalize-document\",\"TaskSettingNameArray\": [\"task-detect-and-normalize-document\"]},{\"Name\": \"roi-normalize-document-binary\",\"TaskSettingNameArray\": [\"task-normalize-document-binary\"]},  {\"Name\": \"roi-normalize-document-gray\",\"TaskSettingNameArray\": [\"task-normalize-document-gray\"]},  {\"Name\": \"roi-normalize-document-color\",\"TaskSettingNameArray\": [\"task-normalize-document-color\"]}],\"DocumentNormalizerTaskSettingOptions\": [{\"Name\": \"task-detect-and-normalize-document\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect-and-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect-and-normalize\"}]},{\"Name\": \"task-detect-document-boundaries\",\"TerminateSetting\": {\"Section\": \"ST_DOCUMENT_DETECTION\"},\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-detect\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-detect\"}]},{\"Name\": \"task-normalize-document-binary\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",   \"ColourMode\": \"ICM_BINARY\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},  {\"Name\": \"task-normalize-document-gray\",   \"ColourMode\": \"ICM_GRAYSCALE\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]},  {\"Name\": \"task-normalize-document-color\",   \"ColourMode\": \"ICM_COLOUR\",\"StartSection\": \"ST_DOCUMENT_NORMALIZATION\",\"SectionImageParameterArray\": [{\"Section\": \"ST_REGION_PREDETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_DETECTION\",\"ImageParameterName\": \"ip-normalize\"},{\"Section\": \"ST_DOCUMENT_NORMALIZATION\",\"ImageParameterName\": \"ip-normalize\"}]}],\"ImageParameterOptions\": [{\"Name\": \"ip-detect-and-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}},{\"Name\": \"ip-detect\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0,\"ThresholdCompensation\" : 7}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7},\"ScaleDownThreshold\" : 512},{\"Name\": \"ip-normalize\",\"BinarizationModes\": [{\"Mode\": \"BM_LOCAL_BLOCK\",\"BlockSizeX\": 0,\"BlockSizeY\": 0,\"EnableFillBinaryVacancy\": 0}],\"TextDetectionMode\": {\"Mode\": \"TTDM_WORD\",\"Direction\": \"HORIZONTAL\",\"Sensitivity\": 7}}]}");
  }

  getSVGWidth(){
    if (this.img && this.svgElement) {
      this.svgElement.style.height = "100%";
      let imgRatio = this.img.naturalWidth/this.img.naturalHeight;
      let width = this.svgElement.clientHeight * imgRatio;
      if (width>this.svgElement.parentElement.clientWidth) {
        width = this.svgElement.parentElement.clientWidth;
        this.svgElement.style.height = width / imgRatio + "px";
      }
      return width;
    }
    return "100%";
  }

  onSVGPointerMove(e:PointerEvent){
    if (e.pointerType != "mouse" && !this.usingTouchEvent) {
      e.stopPropagation();
      e.preventDefault();
      this.onSVGMouseMove(e);
    }
  }

  onSVGPointerDown(e:PointerEvent){
    if (e.pointerType != "mouse" && !this.usingTouchEvent) {
      this.onSVGMouseDown(e);
    }
  }

  onSVGPointerUp(e:PointerEvent) {
    if (e.pointerType != "mouse" && !this.usingTouchEvent) {
      this.svgMouseDownPoint = undefined;
      this.selectedHandlerIndex = -1;
    }
  }

  onSVGPointerLeave() {
    this.svgMouseDownPoint = undefined;
  }

  onPolygonPointerDown(e:PointerEvent){
    if (e.pointerType != "mouse" && !this.usingTouchEvent) {
      this.onPolygonMouseDown(e);
    }
  }

  onPolygonPointerUp(e:PointerEvent){
    e.stopPropagation();
    this.selectedHandlerIndex = -1;
    this.polygonMouseDown = false;
  }

  onImageLoaded(){
    if (this.imageLoaded) {
      this.imageLoaded.emit();
    }
  }

  render() {
    return (
      <Host ref={(el) => this.root = el}>
        <div class="container absolute"
          ref={(el) => this.containerElement = el}
          onWheel={(e:WheelEvent)=>this.onContainerWheel(e)}
          onMouseUp={()=>this.onContainerMouseUp()}
        >
          <canvas 
            ref={(el) => this.canvasElement = el as HTMLCanvasElement}
            class="hidden-canvas"
          ></canvas>
          <svg 
            version="1.1" 
            ref={(el) => this.svgElement = el as SVGElement}
            class="cropper-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={this.viewBox}
            width={this.getSVGWidth()}
            style={{transform:this.getPanAndZoomStyle()}}
            onMouseMove={(e:MouseEvent)=>this.onSVGMouseMove(e)}
            onMouseDown={(e:MouseEvent)=>this.onSVGMouseDown(e)}
            onTouchStart={(e:TouchEvent)=>this.onSVGTouchStart(e)}
            onTouchEnd={()=>this.onSVGTouchEnd()}
            onTouchMove={(e:TouchEvent)=>this.onSVGTouchMove(e)}
            onPointerMove={(e:PointerEvent)=>this.onSVGPointerMove(e)}
            onPointerDown={(e:PointerEvent)=>this.onSVGPointerDown(e)}
            onPointerUp={(e:PointerEvent)=>this.onSVGPointerUp(e)}
            onPointerLeave={()=>this.onSVGPointerLeave()}
          >
            <image 
              onLoad={()=>this.onImageLoaded()}
              ref={(el) => this.imgElement = el as SVGImageElement}
              href={this.img ? this.img.src : ""}>
            </image>
            {this.rendenInactiveSelections()}
            <polygon
              points={this.getPointsData()}
              class="cropper-controls dashed"
              stroke-width={this.activeStroke * this.getRatio()}
              fill="transparent"
              onMouseDown={(e:MouseEvent)=>this.onPolygonMouseDown(e)}
              onMouseUp={(e:MouseEvent)=>this.onPolygonMouseUp(e)}
              onTouchStart={(e:TouchEvent)=>this.onPolygonTouchStart(e)}
              onTouchEnd={(e:TouchEvent)=>this.onPolygonTouchEnd(e)}
              onPointerDown={(e:PointerEvent)=>this.onPolygonPointerDown(e)}
              onPointerUp={(e:PointerEvent)=>this.onPolygonPointerUp(e)}
            >
            </polygon>
            {this.renderHandlers()}
          </svg>
          {this.renderFooter()}
          <slot></slot>
        </div>
      </Host>
    );
  }

}
