import { EnumCapturedResultItemType, Quadrilateral } from "@dynamsoft/dynamsoft-core";
export interface SimplifiedCaptureVisionSettings {
    capturedResultItemTypes: EnumCapturedResultItemType;
    roi: Quadrilateral;
    roiMeasuredInPercentage: boolean;
    timeout: number;
    /**
     * @brief Minimum time interval (in milliseconds) allowed between consecutive image captures.
     *
     * This property represents the minimum time interval (in milliseconds) that must
     * elapse before the next image capture operation can be initiated.
     * Setting a larger value for this property will introduce a delay between image
     * captures, while setting a smaller value allows for more frequent captures. It
     * can be used to reduce the computational frequency, which can effectively lower
     * energy consumption.
     *
     * @note The actual time interval between captures may be longer than the specified
     *       minimum interval due to various factors, such as image processing time and
     *       hardware limitations.
     *
     */
    minImageCaptureInterval: number;
    barcodeSettings: any;
}
//# sourceMappingURL=simplifiedcapturevisionsettings.d.ts.map