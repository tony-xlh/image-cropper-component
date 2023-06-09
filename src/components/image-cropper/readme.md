# image-cropper



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type               | Default     |
| ------------- | ------------- | ----------- | ------------------ | ----------- |
| `handlersize` | `handlersize` |             | `string`           | `undefined` |
| `hidefooter`  | `hidefooter`  |             | `string`           | `undefined` |
| `img`         | --            |             | `HTMLImageElement` | `undefined` |
| `license`     | `license`     |             | `string`           | `undefined` |
| `quad`        | --            |             | `Quad`             | `undefined` |
| `rect`        | --            |             | `Rect`             | `undefined` |


## Events

| Event       | Description | Type                |
| ----------- | ----------- | ------------------- |
| `canceled`  |             | `CustomEvent<void>` |
| `confirmed` |             | `CustomEvent<void>` |


## Methods

### `detect(source: string | HTMLImageElement | Blob | HTMLCanvasElement) => Promise<DetectedQuadResult[]>`



#### Returns

Type: `Promise<DetectedQuadResult[]>`



### `getCroppedImage(perspectiveTransform?: boolean, colorMode?: "binary" | "gray" | "color") => Promise<string>`



#### Returns

Type: `Promise<string>`



### `getPoints() => Promise<[Point, Point, Point, Point]>`



#### Returns

Type: `Promise<[Point, Point, Point, Point]>`



### `getQuad() => Promise<Quad>`



#### Returns

Type: `Promise<Quad>`



### `getRect() => Promise<Rect>`



#### Returns

Type: `Promise<Rect>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
