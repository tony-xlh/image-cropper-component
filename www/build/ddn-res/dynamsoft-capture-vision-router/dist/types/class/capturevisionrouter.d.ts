import CapturedResultReceiver from "./capturedresultreceiver";
import IntermediateResultManager from "./intermediateresultmanager";
import { ImageSourceStateListener } from "../interface/imagesourcestatelistener";
import { SimplifiedCaptureVisionSettings } from "../interface/simplifiedcapturevisionsettings";
import { CapturedResultFilter } from "../interface/capturedresultfilter";
import { Point, DSImageData, ImageSourceAdapter, CapturedResult, EnumCapturedResultItemType, IntermediateResultUnit, IntermediateResultExtraInfo } from "@dynamsoft/dynamsoft-core";
export default class CaptureVisionRouter {
    private _maxCvsSideLength;
    get maxCvsSideLength(): number;
    set maxCvsSideLength(value: number);
    /**
     * about isa (Image Source Adapter)
     */
    private _isa;
    private get isa();
    private set isa(value);
    static _onLog: (message: any) => void;
    _dsImage: DSImageData;
    private static _oldTemplateMap;
    private static _builtInDbrTemplates;
    private static _builtInDlrTemplates;
    private static _builtInDdnTemplates;
    private _instanceID;
    private _loopReadVideoTimeoutId;
    private _bPauseScan;
    private _bNeedOutputOriginalImage;
    private _canvas;
    private _irrRegistryState;
    private _resultReceiverSet;
    private _isaStateListenerSet;
    private _resultFilterSet;
    private _intermediateResultReceiverSet;
    private _intermediateResultManager;
    private _templateName;
    private _bOpenDetectVerify;
    private _bOpenNormalizeVerify;
    private _bOpenBarcodeVerify;
    private _bOpenLabelVerify;
    private _minImageCaptureInterval;
    private _averageProcessintTimeArray;
    private _averageFetchImageTimeArray;
    private _currentSettings;
    private _averageTime;
    protected captureInParallel: boolean;
    /**
     * Returns whether the instance has been disposed.
     */
    protected bDestroyed: boolean;
    get disposed(): boolean;
    private _checkIsDisposed;
    /**
     * Creates an instance of CaptureVisionRouter.
     * @remarks When creating the instance, CaptureVisionRouter will get all the licensed components from Dynamsoft.Core and instantiate them.
     */
    static createInstance(): Promise<CaptureVisionRouter>;
    /**
     * NOTE: for the time being
     * If DCE JS instance is passed in as the image source, CVR will
     * know that it has a UI to draw on because it will register itself
     * as an IRR/CRR target.
     */
    setInput(imageSource: ImageSourceAdapter): void;
    getInput(): ImageSourceAdapter;
    /**
     * Adds or removes listeners for image source state change.
     */
    addImageSourceStateListener(listener: ImageSourceStateListener): void;
    removeImageSourceStateListener(listener: ImageSourceStateListener): boolean;
    /** Adds / removes receivers for algorithm results.
     * If result filter is added, then the results are the ones after the filtering.
     */
    addResultReceiver(receiver: CapturedResultReceiver): void;
    removeResultReceiver(receiver: CapturedResultReceiver): void;
    private _setCrrRegistry;
    /**
     * Adds/removes result filters which are applied to original algorithm results.
     */
    addResultFilter(filter: CapturedResultFilter): Promise<void>;
    removeResultFilter(filter: CapturedResultFilter): void;
    private _handleFilterSwitch;
    /**
     * _promiseStartScan.status == "pending"; // camera is openning.
     * _promiseStartScan.status == "fulfilled"; // camera is opened.
     * _promiseStartScan == null; // camera is closed.
     * Chooses a template and starts the capturing process.
     */
    private _promiseStartScan;
    startCapturing(templateName?: string): Promise<void>;
    stopCapturing(): void;
    private _clearVerifyList;
    _getIntermediateResult(): Promise<{
        intermediateResultUnits: Array<IntermediateResultUnit>;
        info: IntermediateResultExtraInfo;
    }>;
    /**
     * Video stream capture, recursive call, loop frame capture
     */
    private _loopReadVideo;
    private _reRunCurrnetFunc;
    /**
     * Process an image or a file to extract information.
     */
    capture(imageOrFile: Blob | string | Uint8Array | ArrayBuffer | DSImageData | HTMLImageElement | HTMLVideoElement | Uint8ClampedArray | HTMLCanvasElement, templateName?: string, bScanner?: boolean): Promise<CapturedResult>;
    private _captureDsimage;
    private _captureUrl;
    private _captureBase64;
    private _captureBlob;
    private _captureImage;
    private _captureCanvas;
    private _captureVideo;
    private _captureInWorker;
    /**
     * settings can either be a JSON string or a url to a JSON file
     */
    initSettings(settings: string | object): Promise<any>;
    /** If no template name specified, or templateName = "*", export all the templates. */
    outputSettings(templateName: string): Promise<any>;
    outputSettingsToFile(templateName: string, fileName: string, download?: boolean): Promise<Blob>;
    /**
     * Returns a SimplifiedCaptureVisionSettings object constructed based on the current internal template.
     * @param templateName Specifies a template to return a SimplifiedCaptureVisionSettings for it
     * @remarks If the underlying CaptureSettings is too complicated, we cannot construct a Simplified CaptureSettings in which case it returns null.
     */
    getSimplifiedSettings(templateName?: string): Promise<SimplifiedCaptureVisionSettings>;
    /**
     * Updates a few key settings with new values.
     * Simplified Capture Settings are meant for fast configuration of the process. Due to its simplicity, it is not very flexible nor powerful. The limitations are
     * 1. There is only one target ROI (the input image?)
     * 2. For the ROI, one SDK only process once
     * 3. Processes don't rely on each other
     * @param templateName specifies a template which will be updated with the passed settings
     * @param settings Specify the settings used to update the template
     */
    updateSettings(templateName: string, settings: SimplifiedCaptureVisionSettings): Promise<any>;
    /**
     * Resets all settings to default values.
     * @remarks For certain editions like the JS edition, the default may not be exactly the same as with C++.
     */
    resetSettings(): Promise<any>;
    /**
     * Returns an object that takes care of the retrieval of intermediate results.
     * Later we can update the intermediate results (not for now 2023/09/13).
     */
    getIntermediateResultManager(bInner?: boolean): IntermediateResultManager;
    private _handleIntermediateResultReceiver;
    private _enableResultCrossVerification;
    private _enableResultDeduplication;
    private _setDuplicateForgetTime;
    _getDuplicateForgetTime(type: EnumCapturedResultItemType): Promise<number>;
    _setThresholdValue(threshold: number, leftLimit: number, rightLimit: number): Promise<void>;
    contains(points: [Point, Point, Point, Point], point: Point): boolean;
    /**
     * Disposes the instance itself and all the component instances.
     */
    dispose(): Promise<void>;
}
//# sourceMappingURL=capturevisionrouter.d.ts.map