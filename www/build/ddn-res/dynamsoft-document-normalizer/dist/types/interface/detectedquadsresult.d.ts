import { CapturedResult, ImageTag } from "@dynamsoft/dynamsoft-core";
import { DetectedQuadResultItem } from "./detectedquadresultitem";
export interface DetectedQuadsResult extends CapturedResult {
    readonly originalImageHashId: string;
    readonly originalImageTag: ImageTag;
    quadsResultItems: Array<DetectedQuadResultItem>;
}
//# sourceMappingURL=detectedquadsresult.d.ts.map