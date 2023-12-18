import { ImageTag } from "./ImageTag";
import { EnumImagePixelFormat } from "../enum/EnumImagePixelFormat";
export interface DSImageData {
    bytes: Uint8Array;
    width: number;
    height: number;
    stride: number;
    format: EnumImagePixelFormat;
    tag?: ImageTag;
}
//# sourceMappingURL=DSImageData.d.ts.map