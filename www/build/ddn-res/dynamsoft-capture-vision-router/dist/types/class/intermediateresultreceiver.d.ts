import { CandidateBarcodeZonesUnit, ComplementedBarcodeImageUnit, DecodedBarcodesUnit, DeformationResistedBarcodeImageUnit, LocalizedBarcodesUnit, ScaledUpBarcodeImageUnit } from "@dynamsoft/dynamsoft-barcode-reader";
import { BinaryImageUnit, ColourImageUnit, ContoursUnit, EnhancedGrayscaleImageUnit, GrayscaleImageUnit, IntermediateResult, IntermediateResultExtraInfo, LineSegmentsUnit, PredetectedRegionsUnit, ScaledDownColourImageUnit, TextRemovedBinaryImageUnit, TextZonesUnit, TextureDetectionResultUnit, TextureRemovedBinaryImageUnit, TextureRemovedGrayscaleImageUnit, TransformedGrayscaleImageUnit } from "@dynamsoft/dynamsoft-core";
import { CandidateQuadEdgesUnit, CornersUnit, DetectedQuadsUnit, LongLinesUnit, NormalizedImagesUnit } from "@dynamsoft/dynamsoft-document-normalizer";
export default class IntermediateResultReceiver {
    onTaskResultsReceived?: (result: IntermediateResult, info: IntermediateResultExtraInfo) => void;
    onPredetectedRegionsReceived?: (result: PredetectedRegionsUnit, info: IntermediateResultExtraInfo) => void;
    onLocalizedBarcodesReceived?: (result: LocalizedBarcodesUnit, info: IntermediateResultExtraInfo) => void;
    onDecodedBarcodesReceived: (result: DecodedBarcodesUnit, info: IntermediateResultExtraInfo) => void;
    onLocalizedTextLinesReceived: (result: any, info: IntermediateResultExtraInfo) => void;
    onRecognizedTextLinesReceived: (result: any, info: IntermediateResultExtraInfo) => void;
    onDetectedQuadsReceived?: (result: DetectedQuadsUnit, info: IntermediateResultExtraInfo) => void;
    onNormalizedImagesReceived?: (result: NormalizedImagesUnit, info: IntermediateResultExtraInfo) => void;
    onColourImageUnitReceived?: (result: ColourImageUnit, info: IntermediateResultExtraInfo) => void;
    onScaledDownColourImageUnitReceived?: (result: ScaledDownColourImageUnit, info: IntermediateResultExtraInfo) => void;
    onGrayscaleImageUnitReceived?: (result: GrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onTransformedGrayscaleImageUnitReceived?: (result: TransformedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onEnhancedGrayscaleImageUnitReceived?: (result: EnhancedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onBinaryImageUnitReceived?: (result: BinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onTextureDetectionResultUnitReceived?: (result: TextureDetectionResultUnit, info: IntermediateResultExtraInfo) => void;
    onTextureRemovedGrayscaleImageUnitReceived?: (result: TextureRemovedGrayscaleImageUnit, info: IntermediateResultExtraInfo) => void;
    onTextureRemovedBinaryImageUnitReceived?: (result: TextureRemovedBinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onContoursUnitReceived?: (result: ContoursUnit, info: IntermediateResultExtraInfo) => void;
    onLineSegmentsUnitReceived?: (result: LineSegmentsUnit, info: IntermediateResultExtraInfo) => void;
    onTextZonesUnitReceived?: (result: TextZonesUnit, info: IntermediateResultExtraInfo) => void;
    onTextRemovedBinaryImageUnitReceived?: (result: TextRemovedBinaryImageUnit, info: IntermediateResultExtraInfo) => void;
    onLongLinesUnitReceived?: (result: LongLinesUnit, info: IntermediateResultExtraInfo) => void;
    onCornersUnitReceived?: (result: CornersUnit, info: IntermediateResultExtraInfo) => void;
    onCandidateQuadEdgesUnitReceived?: (result: CandidateQuadEdgesUnit, info: IntermediateResultExtraInfo) => void;
    onCandidateBarcodeZonesUnitReceived?: (result: CandidateBarcodeZonesUnit, info: IntermediateResultExtraInfo) => void;
    onScaledUpBarcodeImageUnitReceived?: (result: ScaledUpBarcodeImageUnit, info: IntermediateResultExtraInfo) => void;
    onDeformationResistedBarcodeImageUnitReceived?: (result: DeformationResistedBarcodeImageUnit, info: IntermediateResultExtraInfo) => void;
    onComplementedBarcodeImageUnitReceived?: (result: ComplementedBarcodeImageUnit, info: IntermediateResultExtraInfo) => void;
}
//# sourceMappingURL=intermediateresultreceiver.d.ts.map