import { Quadrilateral, CapturedResultItem } from "@dynamsoft/dynamsoft-core";
export interface DetectedQuadResultItem extends CapturedResultItem {
    location: Quadrilateral;
    confidenceAsDocumentBoundary: number;
}
//# sourceMappingURL=detectedquadresultitem.d.ts.map