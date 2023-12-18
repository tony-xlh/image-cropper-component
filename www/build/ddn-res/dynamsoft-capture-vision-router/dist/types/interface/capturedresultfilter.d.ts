import { DecodedBarcodesResult } from "@dynamsoft/dynamsoft-barcode-reader";
import { OriginalImageResultItem } from "@dynamsoft/dynamsoft-core";
import { DetectedQuadsResult, NormalizedImagesResult } from "@dynamsoft/dynamsoft-document-normalizer";
export interface CapturedResultFilter {
    onOriginalImageResultReceived?: (result: OriginalImageResultItem) => void;
    onDecodedBarcodesReceived?: (result: DecodedBarcodesResult) => void;
    onRecognizedTextLinesReceived?: (result: any) => void;
    onDetectedQuadsReceived?: (result: DetectedQuadsResult) => void;
    onNormalizedImagesReceived?: (result: NormalizedImagesResult) => void;
    onParsedResultsReceived?: (result: any) => void;
}
//# sourceMappingURL=capturedresultfilter.d.ts.map