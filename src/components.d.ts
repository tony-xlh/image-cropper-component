/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Point, Quad, Rect } from "./components/image-cropper/image-cropper";
import { DetectedQuadResult } from "dynamsoft-document-normalizer";
export { Point, Quad, Rect } from "./components/image-cropper/image-cropper";
export { DetectedQuadResult } from "dynamsoft-document-normalizer";
export namespace Components {
    interface ImageCropper {
        "detect": (source: string | HTMLImageElement | Blob | HTMLCanvasElement) => Promise<DetectedQuadResult[]>;
        "getAllSelections": () => Promise<(Quad | Rect)[]>;
        "getCroppedImage": (perspectiveTransform?: boolean, colorMode?: "binary" | "gray" | "color") => Promise<string>;
        "getPoints": () => Promise<[Point, Point, Point, Point]>;
        "getQuad": () => Promise<Quad>;
        "getRect": () => Promise<Rect>;
        "handlersize"?: string;
        "hidefooter"?: string;
        "img"?: HTMLImageElement;
        "inactiveSelections"?: (Quad|Rect)[];
        "license"?: string;
        "quad"?: Quad;
        "rect"?: Rect;
    }
}
export interface ImageCropperCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLImageCropperElement;
}
declare global {
    interface HTMLImageCropperElement extends Components.ImageCropper, HTMLStencilElement {
    }
    var HTMLImageCropperElement: {
        prototype: HTMLImageCropperElement;
        new (): HTMLImageCropperElement;
    };
    interface HTMLElementTagNameMap {
        "image-cropper": HTMLImageCropperElement;
    }
}
declare namespace LocalJSX {
    interface ImageCropper {
        "handlersize"?: string;
        "hidefooter"?: string;
        "img"?: HTMLImageElement;
        "inactiveSelections"?: (Quad|Rect)[];
        "license"?: string;
        "onCanceled"?: (event: ImageCropperCustomEvent<void>) => void;
        "onConfirmed"?: (event: ImageCropperCustomEvent<void>) => void;
        "onSelectionClicked"?: (event: ImageCropperCustomEvent<number>) => void;
        "quad"?: Quad;
        "rect"?: Rect;
    }
    interface IntrinsicElements {
        "image-cropper": ImageCropper;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "image-cropper": LocalJSX.ImageCropper & JSXBase.HTMLAttributes<HTMLImageCropperElement>;
        }
    }
}
