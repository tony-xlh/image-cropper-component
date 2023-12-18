import { DSImageData } from "../interface/DSImageData";
import { EnumBufferOverflowProtectionMode } from "../enum/EnumBufferOverflowProtectionMode";
import { EnumColourChannelUsageType } from "../enum/EnumColourChannelUsageType";
import { ImageSourceErrorListener } from "../interface";
export default abstract class ImageSourceAdapter {
    #private;
    /**
     * @ignore
     */
    static _onLog: (message: any) => void;
    /**
     * @ignore
     */
    get _isFetchingStarted(): boolean;
    constructor();
    abstract hasNextImageToFetch(): boolean;
    /**
     * @brief Sets the error listener for the image source.
     *
     * This function allows you to set an error listener object that will receive
     * notifications when errors occur during image source operations.
     * If an error occurs, the error information will be passed to the listener's
     * OnErrorReceived method.
     *
     * @param listener An instance of ImageSourceErrorListener or its
     *                 derived class, which will handle error notifications.
     */
    setErrorListener(listener: ImageSourceErrorListener): void;
    /**
     * Add images (of the type DSImageData) to the buffer.
     */
    addImageToBuffer(image: DSImageData): void;
    getImage(): DSImageData;
    /**
     * This method can set the processing priority of an image.
     */
    setNextImageToReturn(imageId: number, keepInBuffer?: boolean): void;
    /**
     * @ignore
     */
    _resetNextReturnedImage(): void;
    hasImage(imageId: number): boolean;
    startFetching(): void;
    stopFetching(): void;
    setMaxImageCount(count: number): void;
    getMaxImageCount(): number;
    getImageCount(): number;
    clearBuffer(): void;
    isBufferEmpty(): boolean;
    setBufferOverflowProtectionMode(mode: EnumBufferOverflowProtectionMode): void;
    getBufferOverflowProtectionMode(): EnumBufferOverflowProtectionMode;
    setColourChannelUsageType(type: EnumColourChannelUsageType): void;
    getColourChannelUsageType(): EnumColourChannelUsageType;
}
//# sourceMappingURL=ImageSourceAdapter.d.ts.map