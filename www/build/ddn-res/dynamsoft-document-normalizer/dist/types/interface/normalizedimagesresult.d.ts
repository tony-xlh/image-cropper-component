import { CapturedResult, ImageTag } from "@dynamsoft/dynamsoft-core";
import { NormalizedImageResultItem } from "./normalizedimageresultitem";
export interface NormalizedImagesResult extends CapturedResult {
    readonly originalImageHashId: string;
    readonly originalImageTag: ImageTag;
    normalizedImageResultItems: Array<NormalizedImageResultItem>;
}
//# sourceMappingURL=normalizedimagesresult.d.ts.map