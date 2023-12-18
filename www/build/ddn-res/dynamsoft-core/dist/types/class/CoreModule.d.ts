import MutablePromise from "mutable-promise";
export declare const mapAsyncDependency: {
    [key: string]: MutablePromise<any>;
};
export declare const newAsyncDependency: (depName: string) => {
    p: MutablePromise<any>;
    justWait: boolean;
};
export declare const waitAsyncDependency: (depName: string) => MutablePromise<any>;
export declare let worker: Worker;
export declare const getNextTaskID: () => number;
export declare const mapTaskCallBack: {
    [key: string]: Function;
};
export declare let onLog: (message: any) => void | undefined;
export declare const setOnLog: (value: typeof onLog) => void;
export declare let bDebug: boolean;
export declare const setBDebug: (value: boolean) => void;
export declare const innerVersions: {
    [key: string]: {
        worker?: string;
        wasm?: string;
    };
};
export declare const mapPackageRegister: {
    [key: string]: any;
};
interface ProxyEngineResourcePaths {
    "rootDirectory"?: string;
    "std"?: string;
    "dip"?: string;
    "dnn"?: string;
    "core"?: string;
    "license"?: string;
    "cvr"?: string;
    "utility"?: string;
    "dbr"?: string;
    "dlr"?: string;
    "ddn"?: string;
    "dcp"?: string;
    [moduleName: string]: string;
}
export declare const engineResourcePaths: {
    "rootDirectory"?: string;
    "std"?: string | {
        version: string;
        path: string;
    };
    "dip"?: string | {
        version: string;
        path: string;
    };
    "dnn"?: string | {
        version: string;
        path: string;
    };
    "core"?: string;
    "license"?: string;
    "cvr"?: string;
    "utility"?: string;
    "dbr"?: string;
    "dlr"?: string;
    "ddn"?: string;
    "dcp"?: string;
    [moduleName: string]: string | {
        version: string;
        path: string;
    };
};
export declare const workerAutoResources: {
    [key: string]: {
        js?: string[] | boolean;
        wasm?: string[] | boolean;
    };
};
export declare const loadWasm: (names?: string[] | string) => Promise<any>;
export default class CoreModule {
    static get engineResourcePaths(): ProxyEngineResourcePaths;
    static set engineResourcePaths(value: ProxyEngineResourcePaths);
    private static _bSupportDce4Module;
    static get bSupportDce4Module(): number;
    private static _bSupportIRTModule;
    static get bSupportIRTModule(): number;
    private static _versions;
    static get versions(): any;
    static get onLog(): (message: any) => void;
    static set onLog(value: (message: any) => void);
    static get _bDebug(): boolean;
    static set _bDebug(value: boolean);
    static _workerName: string;
    /**
     * Determine if the decoding module has been loaded successfully.
     * @category Initialize and Destroy
     */
    static isModuleLoaded(name?: string): boolean;
    static loadWasm(names: string[] | string): Promise<any>;
    /**
     * Detect environment and get a report.
     */
    static detectEnvironment(): Promise<any>;
    /**
     * modify from https://gist.github.com/2107/5529665
     * @ignore
     */
    static browserInfo: any;
    static getModuleVersion(): Promise<any>;
    static getVersion(): string;
    static enableLogging(): void;
    static disableLogging(): void;
}
export {};
//# sourceMappingURL=CoreModule.d.ts.map