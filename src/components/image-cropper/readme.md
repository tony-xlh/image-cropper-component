# image-cropper



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute      | Description | Type                   | Default     |
| -------------------- | -------------- | ----------- | ---------------------- | ----------- |
| `draggingmode`       | `draggingmode` |             | `"x-only" \| "y-only"` | `undefined` |
| `handlersize`        | `handlersize`  |             | `string`               | `undefined` |
| `hidefooter`         | `hidefooter`   |             | `string`               | `undefined` |
| `img`                | --             |             | `HTMLImageElement`     | `undefined` |
| `inactiveSelections` | --             |             | `(Quad \| Rect)[]`     | `undefined` |
| `license`            | `license`      |             | `string`               | `undefined` |
| `quad`               | --             |             | `Quad`                 | `undefined` |
| `rect`               | --             |             | `Rect`                 | `undefined` |


## Events

| Event              | Description | Type                  |
| ------------------ | ----------- | --------------------- |
| `canceled`         |             | `CustomEvent<void>`   |
| `confirmed`        |             | `CustomEvent<void>`   |
| `imageLoaded`      |             | `CustomEvent<void>`   |
| `selectionClicked` |             | `CustomEvent<number>` |


## Methods

### `detect(source: string | HTMLImageElement | Blob | HTMLCanvasElement) => Promise<DetectedQuadResult[]>`



#### Parameters

| Name     | Type                                                      | Description |
| -------- | --------------------------------------------------------- | ----------- |
| `source` | `string \| HTMLCanvasElement \| HTMLImageElement \| Blob` |             |

#### Returns

Type: `Promise<DetectedQuadResult[]>`



### `fitActualSize() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `fitWidth() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `fitWindow() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `getAllSelections(convertTo?: "rect" | "quad") => Promise<(Quad | Rect)[]>`



#### Parameters

| Name        | Type               | Description |
| ----------- | ------------------ | ----------- |
| `convertTo` | `"rect" \| "quad"` |             |

#### Returns

Type: `Promise<(Quad | Rect)[]>`



### `getCroppedImage(options: CropOptions) => Promise<string>`



#### Parameters

| Name      | Type          | Description |
| --------- | ------------- | ----------- |
| `options` | `CropOptions` |             |

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



### `resetStates() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
