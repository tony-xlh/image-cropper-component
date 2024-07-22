/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { CropOptions, DetectedQuadResult, Point, Quad, Rect } from "./components/image-cropper/image-cropper";
import { CapturedResult } from "dynamsoft-core";
import { DetectedQuadResultItem, NormalizedImageResultItem } from "dynamsoft-document-normalizer";
export { CropOptions, DetectedQuadResult, Point, Quad, Rect } from "./components/image-cropper/image-cropper";
export { CapturedResult } from "dynamsoft-core";
export { DetectedQuadResultItem, NormalizedImageResultItem } from "dynamsoft-document-normalizer";
export namespace Components {
    interface ImageCropper {
        "detect": (source: string | HTMLImageElement | Blob | HTMLCanvasElement) => Promise<DetectedQuadResult[]>;
        "draggingmode"?: "x-only"|"y-only";
        "getAllSelections": (convertTo?: "rect" | "quad") => Promise<(Quad | Rect)[]>;
        "getCroppedImage": (options: CropOptions) => Promise<string>;
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
        "resetStates": () => Promise<void>;
    }
}
export interface ImageCropperCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLImageCropperElement;
}
declare global {
    interface HTMLImageCropperElementEventMap {
        "confirmed": void;
        "canceled": void;
        "selectionClicked": number;
    }
    interface HTMLImageCropperElement extends Components.ImageCropper, HTMLStencilElement {
        addEventListener<K extends keyof HTMLImageCropperElementEventMap>(type: K, listener: (this: HTMLImageCropperElement, ev: ImageCropperCustomEvent<HTMLImageCropperElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLImageCropperElementEventMap>(type: K, listener: (this: HTMLImageCropperElement, ev: ImageCropperCustomEvent<HTMLImageCropperElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
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
        "draggingmode"?: "x-only"|"y-only";
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
