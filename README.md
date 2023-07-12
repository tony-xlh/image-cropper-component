[![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)](https://stenciljs.com)

# Image Cropper Component

An image cropper web component which allows users to crop a rectangle or a 4-point polygon. Perspective transformation is performed using [Dynamsoft Document Normalizer](https://www.dynamsoft.com/document-normalizer/docs/introduction/) for polygon.

![polygon-normalizing](https://github.com/tony-xlh/image-cropper-component/assets/5462205/7ff43017-eb50-4da1-9b53-f7a825ca11da)

[Demo video](https://github.com/tony-xlh/image-cropper-component/assets/5462205/754d7d39-d7a6-4a53-b17c-b1d83e399b5b)

[Online demo](https://candid-tarsier-04033c.netlify.app/)

### Usage

In your HTML, add the component:

```html
<image-cropper></image-cropper>
```

Pass an image element and a predefined region for the cropper:

```js
let cropper = document.querySelector("image-cropper");
cropper.img = document.getElementById("original");
cropper.rect = {x:50,y:50,width:200,height:200}; // or quadrilateral: cropper.quad = {points:[{x:50,y:50},{x:250,y:50},{x:250,y:250},{x:50,y:250}]};
```

It has several methods related to detecting document borders, getting the coordinates, and getting the cropped image.

```ts
"detect": (source: string | HTMLImageElement | Blob | HTMLCanvasElement) => Promise<DetectedQuadResult[]>;
"getCroppedImage": (perspectiveTransform?: boolean, colorMode?: "binary" | "gray" | "color") => Promise<string>;
"getPoints": () => Promise<[Point, Point, Point, Point]>;
"getQuad": () => Promise<Quad>;
"getRect": () => Promise<Rect>;
```

Props:

```ts
"hidefooter"?: string; // hide the default footer with cancel and confirm buttons
"img"?: HTMLImageElement;
"license"?: string; // license for Dynamsoft Document Normalizer
"quad"?: Quad;
"rect"?: Rect;
```

Interfaces:

```ts
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
```

You can customize the style of the selection with the following CSS:

```css
 --line-color:orange;
```

PS: If you need to use Dynamsoft Document Normalizer, please include it in your HTML's head:

```html
<script src="https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@1.0.12/dist/ddn.js"></script>
```

## Install this component

### Script tag

- Put a script tag similar to this 

   ```html
   <script type="module">
     import { defineCustomElements } from 'https://cdn.jsdelivr.net/npm/image-cropper-component/dist/esm/loader.js';
     defineCustomElements();
   </script>
   ```
   
   in the head of your index.html
   
- Then you can use the element anywhere in your template, JSX, html etc

### Node Modules
- Run `npm install image-cropper-component --save`
- Put a script tag similar to this 

   ```html
   <script type="module">
     import { defineCustomElements } from 'node_modules/image-cropper-component/dist/esm/loader.js';
     defineCustomElements();
   </script>
   ```
   
   in the head of your index.html
   
- Then you can use the element anywhere in your template, JSX, html etc

