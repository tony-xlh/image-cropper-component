import { ParsedResultItem } from "@dynamsoft/dynamsoft-code-parser";
export * from "./TypeCheck";
export declare function requestResource(url: string, type: "text" | "blob" | "arraybuffer"): Promise<any>;
export declare function checkIsLink(str: string): boolean;
export declare function handleParsedResultItem(item: ParsedResultItem): void;
declare const bSupportBigInt: boolean;
export { bSupportBigInt };
//# sourceMappingURL=index.d.ts.map