import { Arc, Contour, DSImageData, DSRect, ImageTag, LineSegment, Point, Polygon, Quadrilateral, Rect } from "../interface";
/**
 * Judge if the input is an object(exclude array and function). If `null` or `undefined`, return `false`.
 * @param value
 * @returns
 */
export declare const isObject: (value: any) => value is Object;
/**
 * Judge is the input is a {@link Arc} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isArc: (value: any) => value is Arc;
/**
 * Judge is the input is a {@link Contour} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isContour: (value: any) => value is Contour;
/**
 * Judge is the input is a {@link DSImageData} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isDSImageData: (value: any) => value is DSImageData;
/**
 * Judge is the input is a {@link DSRect} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isDSRect: (value: any) => value is DSRect;
/**
 * Judge is the input is a {@link ImageTag} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isImageTag: (value: any) => value is ImageTag;
/**
 * Judge is the input is a {@link LineSegment} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isLineSegment: (value: any) => value is LineSegment;
/**
 * Judge is the input is a {@link Point} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isPoint: (value: any) => value is Point;
/**
 * Judge is the input is a {@link Polygon} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isPolygon: (value: any) => value is Polygon;
/**
 * Judge is the input is a {@link Quadrilateral} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isQuad: (value: any) => value is Quadrilateral;
/**
 * Judge is the input is a {@link Rect} object.
 * @param value
 * @returns
 * @ignore
 */
export declare const isRect: (value: any) => value is Rect;
//# sourceMappingURL=TypeCheck.d.ts.map