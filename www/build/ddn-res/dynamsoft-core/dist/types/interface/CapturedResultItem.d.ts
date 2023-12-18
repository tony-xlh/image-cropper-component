import { EnumCapturedResultItemType } from "../enum/EnumCapturedResultItemType";
export interface CapturedResultItem {
    readonly type: EnumCapturedResultItemType;
    readonly referenceItem: CapturedResultItem;
}
//# sourceMappingURL=CapturedResultItem.d.ts.map