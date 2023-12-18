import { EnumIntermediateResultUnitType } from "../enum/EnumIntermediateResultUnitType";
import { EnumTransformMatrixType } from "../enum/EnumTransformMatrixType";
import { ImageTag } from "./ImageTag";
export interface IntermediateResultUnit {
    hashId: string;
    originalImageHashId: string;
    originalImageTag: ImageTag;
    unitType: EnumIntermediateResultUnitType;
    /**
     * For the two types TMT_LOCAL_TO_ORIGINAL_IMAGE & TMT_ORIGINAL_TO_LOCAL_IMAGE, we can get both from C++ and then keep the
     * information in JS. Only return the information when customer calls getTransformMatrix with a specified type.
     */
    getTransformMatrix: (matrixType: EnumTransformMatrixType) => Array<number>;
}
//# sourceMappingURL=IntermediateResultUnit.d.ts.map