import { CapturedResultItem } from "./CapturedResultItem";
import { ImageTag } from "./ImageTag";
export interface CapturedResult {
    readonly originalImageHashId: string;
    readonly originalImageTag: ImageTag;
    readonly items: Array<CapturedResultItem>;
    readonly errorCode: number;
    readonly errorString: string;
}
//# sourceMappingURL=CapturedResult.d.ts.map