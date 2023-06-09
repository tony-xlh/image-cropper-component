import { Component, Event, EventEmitter, Fragment, Host, Method, Prop, State, Watch, h } from '@stencil/core';
import { DetectedQuadResult, DocumentNormalizer } from 'dynamsoft-document-normalizer';

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

@Component({
  tag: 'image-cropper',
  styleUrl: 'image-cropper.css',
  shadow: true,
})
export class ImageCropper {
  handlers:number[] = [0,1,2,3,4,5,6,7];
  polygonMouseDown:boolean = false;
  polygonMouseDownPoint:Point = {x:0,y:0};
  handlerMouseDownPoint:Point = {x:0,y:0};
  svgElement:SVGElement;
  canvasElement:HTMLCanvasElement;
  originalPoints:[Point,Point,Point,Point] = undefined;
  ddn:DocumentNormalizer|undefined;
  @Prop() img?: HTMLImageElement;
  @Prop() rect?: Rect;
  @Prop() quad?: Quad;
  @Prop() license?: string;
  @State() viewBox:string = "0 0 1280 720";
  @State() selectedHandlerIndex:number = -1;
  @State() points:[Point,Point,Point,Point] = undefined;
  @Event() confirmed?: EventEmitter<void>;
  @Event() canceled?: EventEmitter<void>;

  @Watch('img')
  watchImgPropHandler(newValue: HTMLImageElement) {
    if (newValue) {
      this.viewBox = "0 0 "+newValue.naturalWidth+" "+newValue.naturalHeight;
    }
  }

  @Watch('rect')
  watchRectPropHandler(newValue: Rect) {
    if (newValue) {
      const point1:Point = {x:newValue.x,y:newValue.y};
      const point2:Point = {x:newValue.x+newValue.width,y:newValue.y};
      const point3:Point = {x:newValue.x+newValue.width,y:newValue.y+newValue.height};
      const point4:Point = {x:newValue.x,y:newValue.y+newValue.height};
      this.points = [point1,point2,point3,point4];
    }
  }

  @Watch('quad')
  watchQuadPropHandler(newValue: Quad) {
    if (newValue) {
      this.points = newValue.points;
    }
  }

  onCanceled(){
    console.log("canceled");
    console.log(this.canceled);
    if (this.canceled){
      console.log("emit");
      this.canceled.emit();
    }
  }

  onConfirmed(){
    console.log("confirmed");
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
            stroke="green" 
            stroke-width={index === this.selectedHandlerIndex ? 4 * this.getRatio() : 2 * this.getRatio()}
            fill="transparent"
            onMouseDown={(e:MouseEvent)=>this.onHandlerMouseDown(e,index)}
            onMouseUp={(e:MouseEvent)=>this.onHandlerMouseUp(e)}
          />
        ))}
      </Fragment>
    )
  }

  renderHandlersMaskDefs(){
    if (!this.points) {
      return (<div></div>)
    }
    return (
      <defs>
        <mask id="myMask">
          <rect 
            x="0" 
            y="0" 
            width={this.img ? this.img.naturalWidth : "0"}
            height={this.img ? this.img.naturalHeight : "0"}
            fill="white" />
          {this.handlers.map(index => (
            <rect 
              x={this.getHandlerPos(index,"x")} 
              y={this.getHandlerPos(index,"y")} 
              width={this.getHandlerSize()}
              height={this.getHandlerSize()} fill="black" 
            />
          ))}
        </mask>
      </defs>
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
    let ratio = this.getRatio()
    return Math.ceil(10*ratio);
  }

  onSVGMouseDown(e:MouseEvent){
    console.log(e);
  }

  onSVGMouseUp(e:MouseEvent){
    this.selectedHandlerIndex = -1;
    this.polygonMouseDown = false;
  }

  onSVGMouseMove(e:MouseEvent){
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
      let coord = this.getMousePosition(e,this.svgElement);
      let offsetX = coord.x - this.handlerMouseDownPoint.x;
      let offsetY = coord.y - this.handlerMouseDownPoint.y;
      let newPoints = JSON.parse(JSON.stringify(this.originalPoints));
      let pointIndex = this.getPointIndexFromHandlerIndex(this.selectedHandlerIndex);
      if (pointIndex != -1) {
        let selectedPoint = newPoints[pointIndex];
        selectedPoint.x = this.originalPoints[pointIndex].x + offsetX;
        selectedPoint.y = this.originalPoints[pointIndex].y + offsetY;
        if (!this.quad) { //rect mode
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
      this.points = newPoints;
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
    this.selectedHandlerIndex = -1;
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
    if (event.targetTouches) { //if it is a touch event
      let x = event.targetTouches[0].clientX;
      let y = event.targetTouches[0].clientY;
      return {
        x: (x - CTM.e) / CTM.a,
        y: (y - CTM.f) / CTM.d
      };
    }else{
      return {
        x: (event.clientX - CTM.e) / CTM.a,
        y: (event.clientY - CTM.f) / CTM.d
      };
    }
  }

  getRatio(){
    if (this.img) {
      return this.img.naturalWidth/750;
    }else{
      return 1;
    }
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
    let minX:number;
    let minY:number;
    let maxX:number;
    let maxY:number;
    for (const point of this.points) {
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
  async getCroppedImage(perspectiveTransform?:boolean,colorMode?:"binary"|"gray"|"color"):Promise<string>
  {
    if (perspectiveTransform && window["Dynamsoft"]["DDN"]) {
      if (!this.ddn) {
        await this.initDDN();
      }
      if (colorMode) {
        let template;
        if (colorMode === "binary") {
          template = "{\"GlobalParameter\":{\"Name\":\"GP\",\"MaxTotalImageDimension\":0},\"ImageParameterArray\":[{\"Name\":\"IP-1\",\"NormalizerParameterName\":\"NP-1\",\"BaseImageParameterName\":\"\"}],\"NormalizerParameterArray\":[{\"Name\":\"NP-1\",\"ContentType\":\"CT_DOCUMENT\",\"ColourMode\":\"ICM_BINARY\"}]}";
        } else if (colorMode === "gray") {
          template = "{\"GlobalParameter\":{\"Name\":\"GP\",\"MaxTotalImageDimension\":0},\"ImageParameterArray\":[{\"Name\":\"IP-1\",\"NormalizerParameterName\":\"NP-1\",\"BaseImageParameterName\":\"\"}],\"NormalizerParameterArray\":[{\"Name\":\"NP-1\",\"ContentType\":\"CT_DOCUMENT\",\"ColourMode\":\"ICM_GRAYSCALE\"}]}";
        } else {
          template = "{\"GlobalParameter\":{\"Name\":\"GP\",\"MaxTotalImageDimension\":0},\"ImageParameterArray\":[{\"Name\":\"IP-1\",\"NormalizerParameterName\":\"NP-1\",\"BaseImageParameterName\":\"\"}],\"NormalizerParameterArray\":[{\"Name\":\"NP-1\",\"ContentType\":\"CT_DOCUMENT\",\"ColourMode\":\"ICM_COLOUR\"}]}";
        }
        await this.ddn.setRuntimeSettings(template);
      }
      let quad = await this.getQuad();
      let normalizedResult = await this.ddn.normalize(this.img,{quad:quad});
      return normalizedResult.image.toCanvas().toDataURL();
    }else{
      let ctx = this.canvasElement.getContext("2d");
      let rect = await this.getRect();
      this.canvasElement.width = rect.width;
      this.canvasElement.height = rect.height;
      ctx.drawImage(this.img, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
      return this.canvasElement.toDataURL();
    }
  }

  @Method()
  async detect(source: string | HTMLImageElement | Blob | HTMLCanvasElement):Promise<DetectedQuadResult[]>
  {
    if (window["Dynamsoft"]["DDN"]["DocumentNormalizer"]) {
      if (!this.ddn) {
        await this.initDDN();
      }
      let results:DetectedQuadResult[] = await this.ddn.detectQuad(source);
      return results;
    }else{
      throw "Dynamsoft Document Normalizer not found";
    }
  }

  async initDDN(){
    window["Dynamsoft"]["DDN"]["DocumentNormalizer"].license = this.license;
    this.ddn = await window["Dynamsoft"]["DDN"]["DocumentNormalizer"].createInstance();
  }

  render() {
    return (
      <Host>
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
          onMouseDown={(e:MouseEvent)=>this.onSVGMouseDown(e)}
          onMouseUp={(e:MouseEvent)=>this.onSVGMouseUp(e)}
          onMouseMove={(e:MouseEvent)=>this.onSVGMouseMove(e)}
        >
          {this.renderHandlersMaskDefs()}
          <image href={this.img ? this.img.src : ""}></image>
          <polygon
            mask="url(#myMask)"
            points={this.getPointsData()}
            stroke="green"
            stroke-width={2 * this.getRatio()}
            fill="transparent"
            onMouseDown={(e:MouseEvent)=>this.onPolygonMouseDown(e)}
            onMouseUp={(e:MouseEvent)=>this.onPolygonMouseUp(e)}
          >
          </polygon>
          {this.renderHandlers()}
        </svg>
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
        <slot></slot>
      </Host>
    );
  }

}
