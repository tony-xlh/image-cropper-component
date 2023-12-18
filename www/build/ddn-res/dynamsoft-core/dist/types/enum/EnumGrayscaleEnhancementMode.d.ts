export declare enum EnumGrayscaleEnhancementMode {
    /**Skips grayscale transformation. */
    GEM_SKIP = 0,
    /**Not supported yet. */
    GEM_AUTO = 1,
    /**Takes the unpreprocessed image for following operations. */
    GEM_GENERAL = 2,
    /**Preprocesses the image using the gray equalization algorithm. Check @ref IPM for available argument settings.*/
    GEM_GRAY_EQUALIZE = 4,
    /**Preprocesses the image using the gray smoothing algorithm. Check @ref IPM for available argument settings.*/
    GEM_GRAY_SMOOTH = 8,
    /**Preprocesses the image using the sharpening and smoothing algorithm. Check @ref IPM for available argument settings.*/
    GEM_SHARPEN_SMOOTH = 16,
    /**Skips image preprocessing. */
    GEM_REV = -2147483648
}
//# sourceMappingURL=EnumGrayscaleEnhancementMode.d.ts.map