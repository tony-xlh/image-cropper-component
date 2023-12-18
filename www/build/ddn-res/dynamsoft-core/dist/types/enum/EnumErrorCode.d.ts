export declare enum EnumErrorCode {
    /**Successful. */
    EC_OK = 0,
    /** -10000~-19999: Common error code. */
    /**Unknown error. */
    EC_UNKNOWN = -10000,
    /**Not enough memory to perform the operation. */
    EC_NO_MEMORY = -10001,
    /**Null pointer */
    EC_NULL_POINTER = -10002,
    /**License invalid*/
    EC_LICENSE_INVALID = -10003,
    /**License expired*/
    EC_LICENSE_EXPIRED = -10004,
    /**File not found*/
    EC_FILE_NOT_FOUND = -10005,
    /**The file type is not supported. */
    EC_FILE_TYPE_NOT_SUPPORTED = -10006,
    /**The BPP (Bits Per Pixel) is not supported. */
    EC_BPP_NOT_SUPPORTED = -10007,
    /**The index is invalid.*/
    EC_INDEX_INVALID = -10008,
    /**The input region value parameter is invalid.*/
    EC_CUSTOM_REGION_INVALID = -10010,
    /**Failed to read the image. */
    EC_IMAGE_READ_FAILED = -10012,
    /**Failed to read the TIFF image. */
    EC_TIFF_READ_FAILED = -10013,
    /**The DIB (Device-Independent Bitmaps) buffer is invalid. */
    EC_DIB_BUFFER_INVALID = -10018,
    /**Failed to read the PDF image. */
    EC_PDF_READ_FAILED = -10021,
    /**The PDF DLL is missing. */
    EC_PDF_DLL_MISSING = -10022,
    /**The page number is invalid. */
    EC_PAGE_NUMBER_INVALID = -10023,
    /**The custom size is invalid. */
    EC_CUSTOM_SIZE_INVALID = -10024,
    /** timeout. */
    EC_TIMEOUT = -10026,
    /**Json parse failed*/
    EC_JSON_PARSE_FAILED = -10030,
    /**Json type invalid*/
    EC_JSON_TYPE_INVALID = -10031,
    /**Json key invalid*/
    EC_JSON_KEY_INVALID = -10032,
    /**Json value invalid*/
    EC_JSON_VALUE_INVALID = -10033,
    /**Json name key missing*/
    EC_JSON_NAME_KEY_MISSING = -10034,
    /**The value of the key "Name" is duplicated.*/
    EC_JSON_NAME_VALUE_DUPLICATED = -10035,
    /**Template name invalid*/
    EC_TEMPLATE_NAME_INVALID = -10036,
    /**The name reference is invalid.*/
    EC_JSON_NAME_REFERENCE_INVALID = -10037,
    /**Parameter value invalid*/
    EC_PARAMETER_VALUE_INVALID = -10038,
    /**The domain of your current site does not match the domain bound in the current product key.*/
    EC_DOMAIN_NOT_MATCH = -10039,
    /**The reserved info does not match the reserved info bound in the current product key.*/
    EC_RESERVED_INFO_NOT_MATCH = -10040,
    /**The license key does not match the license content.*/
    EC_LICENSE_KEY_NOT_MATCH = -10043,
    /**Failed to request the license content.*/
    EC_REQUEST_FAILED = -10044,
    /**Failed to init the license.*/
    EC_LICENSE_INIT_FAILED = -10045,
    /**Failed to set mode's argument.*/
    EC_SET_MODE_ARGUMENT_ERROR = -10051,
    /**The license content is invalid.*/
    EC_LICENSE_CONTENT_INVALID = -10052,
    /**The license key is invalid.*/
    EC_LICENSE_KEY_INVALID = -10053,
    /**The license key has no remaining quota.*/
    EC_LICENSE_DEVICE_RUNS_OUT = -10054,
    /**Failed to get mode's argument.*/
    EC_GET_MODE_ARGUMENT_ERROR = -10055,
    /**The Intermediate Result Types license is invalid.*/
    EC_IRT_LICENSE_INVALID = -10056,
    /**Failed to save file.*/
    EC_FILE_SAVE_FAILED = -10058,
    /**The stage type is invalid.*/
    EC_STAGE_TYPE_INVALID = -10059,
    /**The image orientation is invalid.*/
    EC_IMAGE_ORIENTATION_INVALID = -10060,
    /**Failed to convert complex tempalte to simplified settings.*/
    EC_CONVERT_COMPLEX_TEMPLATE_ERROR = -10061,
    /**Reject function call while capturing in progress.*/
    EC_CALL_REJECTED_WHEN_CAPTURING = -10062,
    /**The input image source was not found.*/
    EC_NO_IMAGE_SOURCE = -10063,
    /**Failed to read directory.*/
    EC_READ_DIRECTORY_FAILED = -10064,
    /**[Name] Module not found.*/
    /**Name : */
    /**DynamsoftBarcodeReader*/
    /**DynamsoftLabelRecognizer*/
    /**DynamsoftDocumentNormalizer*/
    EC_MODULE_NOT_FOUND = -10065,
    /**The api does not support multi-page files. Please use FileFetcher instead.*/
    EC_MULTI_PAGES_NOT_SUPPORTED = -10066,
    /**The file already exists but overwriting is disabled.*/
    EC_FILE_ALREADY_EXISTS = -10067,
    /**The file path does not exist but cannot be created, or cannot be created for any other reason.*/
    EC_CREATE_FILE_FAILED = -10068,
    /**The input ImageData object contains invalid parameter(s).*/
    EC_IMAGE_DATA_INVALID = -10069,
    /**The dimensions of the input image do not meet the requirements.*/
    /**The pixel format of the input image do not meet the requirements.*/
    /**The section level result is irreplaceable.*/
    /** -20000~-29999: DLS license error code. */
    /**No license.*/
    EC_NO_LICENSE = -20000,
    /**The Handshake Code is invalid.*/
    EC_HANDSHAKE_CODE_INVALID = -20001,
    /**Failed to read or write license buffer. */
    EC_LICENSE_BUFFER_FAILED = -20002,
    /**Failed to synchronize license info with license server. */
    EC_LICENSE_SYNC_FAILED = -20003,
    /**Device dose not match with buffer. */
    EC_DEVICE_NOT_MATCH = -20004,
    /**Failed to bind device. */
    EC_BIND_DEVICE_FAILED = -20005,
    /**Instance count is over limit.*/
    EC_INSTANCE_COUNT_OVER_LIMIT = -20008,
    /**Trial License*/
    EC_TRIAL_LICENSE = -20010,
    /**The license is not valid for current version*/
    EC_LICENSE_VERSION_NOT_MATCH = -20011,
    /**Failed to reach License Server.*/
    EC_FAILED_TO_REACH_DLS = -20200,
    /**-30000~-39999: DBR error code*/
    /**The barcode format is invalid.*/
    EC_BARCODE_FORMAT_INVALID = -30009,
    /**The QR Code license is invalid.*/
    EC_QR_LICENSE_INVALID = -30016,
    /**The 1D Barcode license is invalid.*/
    EC_1D_LICENSE_INVALID = -30017,
    /**The PDF417 license is invalid.*/
    EC_PDF417_LICENSE_INVALID = -30019,
    /**The DATAMATRIX license is invalid. */
    EC_DATAMATRIX_LICENSE_INVALID = -30020,
    /**The custom module size is invalid. */
    EC_CUSTOM_MODULESIZE_INVALID = -30025,
    /**The AZTEC license is invalid.*/
    EC_AZTEC_LICENSE_INVALID = -30041,
    /**The Patchcode license is invalid.*/
    EC_PATCHCODE_LICENSE_INVALID = -30046,
    /**The Postal code license is invalid.*/
    EC_POSTALCODE_LICENSE_INVALID = -30047,
    /**The DPM license is invalid.*/
    EC_DPM_LICENSE_INVALID = -30048,
    /**The frame decoding thread already exists.*/
    EC_FRAME_DECODING_THREAD_EXISTS = -30049,
    /**Failed to stop the frame decoding thread.*/
    EC_STOP_DECODING_THREAD_FAILED = -30050,
    /**The Maxicode license is invalid.*/
    EC_MAXICODE_LICENSE_INVALID = -30057,
    /**The GS1 Databar license is invalid.*/
    EC_GS1_DATABAR_LICENSE_INVALID = -30058,
    /**The GS1 Composite code license is invalid.*/
    EC_GS1_COMPOSITE_LICENSE_INVALID = -30059,
    /**The DotCode license is invalid.*/
    EC_DOTCODE_LICENSE_INVALID = -30061,
    /**The Pharmacode license is invalid.*/
    EC_PHARMACODE_LICENSE_INVALID = -30062,
    /**-40000~-49999: DLR error code*/
    /**Character Model file is not found*/
    EC_CHARACTER_MODEL_FILE_NOT_FOUND = -40100,
    /**-50000~-59999: DDN error code*/
    EC_QUADRILATERAL_INVALID = -50057,
    /**-60000~-69999: DCE error code*/
    /**-70000~-79999: Panorama error code*/
    /**The panorama license is invalid.*/
    EC_PANORAMA_LICENSE_INVALID = -70060,
    /**-80000~-89999: Reserved error code*/
    /**-90000~-99999: DCP error code*/
    EC_RESOURCE_PATH_NOT_EXIST = -90001,
    EC_RESOURCE_LOAD_FAILED = -90002,
    EC_CODE_SPECIFICATION_NOT_FOUND = -90003,
    EC_FULL_CODE_EMPTY = -90004,
    EC_FULL_CODE_PREPROCESS_FAILED = -90005,
    EC_ZA_DL_LICENSE_INVALID = -90006,
    EC_AAMVA_DL_ID_LICENSE_INVALID = -90007,
    EC_AADHAAR_LICENSE_INVALID = -90008,
    EC_MRTD_LICENSE_INVALID = -90009,
    EC_VIN_LICENSE_INVALID = -90010,
    EC_CUSTOMIZED_CODE_TYPE_LICENSE_INVALID = -90011
}
//# sourceMappingURL=EnumErrorCode.d.ts.map