import { DetectedQuadsResult, NormalizedImagesResult } from "@dynamsoft/dynamsoft-document-normalizer";
import { DecodedBarcodesResult } from "@dynamsoft/dynamsoft-barcode-reader";
import { CapturedResult, OriginalImageResultItem } from "@dynamsoft/dynamsoft-core";
export default class CapturedResultReceiver {
    onCapturedResultReceived: (result: CapturedResult) => void;
    onOriginalImageResultReceived: (result: OriginalImageResultItem) => void;
    onDecodedBarcodesReceived: (result: DecodedBarcodesResult) => void;
    onRecognizedTextLinesReceived: (result: any) => void;
    onDetectedQuadsReceived: (result: DetectedQuadsResult) => void;
    onNormalizedImagesReceived: (result: NormalizedImagesResult) => void;
    onParsedResultsReceived: (result: any) => void;
}
//# sourceMappingURL=capturedresultreceiver.d.ts.map