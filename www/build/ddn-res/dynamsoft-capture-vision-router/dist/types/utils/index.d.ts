import { CapturedResult, DSImageData, Point } from "@dynamsoft/dynamsoft-core";
import { NormalizedImageResultItem } from "@dynamsoft/dynamsoft-document-normalizer";
export declare function isDSImageData(value: any): boolean;
export declare function getWasmDependentModules(settings: any, templateName?: string): Array<string>;
export declare function checkIsLink(str: string): boolean;
export declare function requestResource(url: string, type: "text" | "blob" | "arraybuffer"): Promise<any>;
type point = Point;
export declare function isPointInQuadrilateral(points: [point, point, point, point], point: point): boolean;
export declare function handleResultForDraw(results: CapturedResult): any;
export declare function getNorImageData(dsImageData: DSImageData): ImageData;
export declare function handleNormalizedImageResultItem(item: NormalizedImageResultItem, retImageData: ImageData): void;
declare const bSupportBigInt: boolean;
export { bSupportBigInt };
//# sourceMappingURL=index.d.ts.map