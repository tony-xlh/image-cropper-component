import { EnumRegionObjectElementType } from "../enum/EnumRegionObjectElementType";
import { Quadrilateral } from "./Quadrilateral";
export interface RegionObjectElement {
    /**
     * location was readonly before v3.2.0
     * In 3.2.0 onwards, it can be set as well
     * When setting, specify the location as well as
     * the matrixToOriginalImage
     */
    location: Quadrilateral;
    referencedElement: RegionObjectElement;
    elementType: EnumRegionObjectElementType;
}
//# sourceMappingURL=RegionObjectElement.d.ts.map