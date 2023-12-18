import { EnumErrorCode } from "../enum";
export interface ImageSourceErrorListener {
    /**
     * Called when an error is received from the image source.
     *
     * @param errorCode An enumeration value of type "EnumErrorCode" indicating the type of error.
     * @param errorMessage A C-style string containing the error message providing
     *                     additional information about the error.
     */
    onErrorReceived: (errorCode: EnumErrorCode, errorMessage: string) => void;
}
//# sourceMappingURL=ImageSourceErrorListener.d.ts.map