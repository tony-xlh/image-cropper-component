import { DSImageData, Quadrilateral, CapturedResultItem } from "@dynamsoft/dynamsoft-core";
export interface NormalizedImageResultItem extends CapturedResultItem {
    imageData: DSImageData;
    location: Quadrilateral;
    toCanvas: () => HTMLCanvasElement;
    toImage: (MIMEType: "image/png" | "image/jpeg") => HTMLImageElement;
    toBlob: (MIMEType: "image/png" | "image/jpeg") => Promise<Blob>;
    saveToFile: (name: string, download?: boolean) => Promise<File>;
}
//# sourceMappingURL=normalizedimageresultitem.d.ts.map