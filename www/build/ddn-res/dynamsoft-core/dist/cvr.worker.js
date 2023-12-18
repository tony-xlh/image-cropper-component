const cvrMapController = {
    "createInstance": async (data, body, taskID) => {
        const instanceID = nextInstanceID++;
        try {
            let instance = new Module["DynamsoftCoreWasm"]();
            importModules = body.importModules;
            for (let i = 0; i < importModules.length; i++) {
                const settings = await requestResource(importModules[i], "text");
                if (importModules[i].includes("DBR-PresetTemplates")) {
                    defaultDbrSettings = settings;
                } else if (importModules[i].includes("DLR-PresetTemplates")) {
                    defaultDlrSettings = settings;
                } else if (importModules[i].includes("DDN-PresetTemplates")) {
                    defaultDdnSettings = settings;
                } else if (importModules[i].includes("MRZ-templates")) {
                    defaultDcpSettings = settings;
                }
                instance.appendParameterContent(settings);
            }
            instance.initParameter();
            mapInstances.set(instanceID, instance);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            instanceID: instanceID
        }
        handleTaskRes(taskID, resBody);
    },
    "dispose": async (data, body, taskID, instanceID) => {
        try {
            checkInstance(instanceID);
            global._emscripten_bind_Destory_CImageData(cImageData);
            cImageData = null;
            Module.destroy(mapInstances.get(instanceID));
            mapInstances.delete(instanceID);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        handleTaskRes(taskID, { success: true });
    },
    "startCapturing": async (data, body, taskID, instanceID) => {
        let bNeedOutputOriginalImage = false;
        try {
            checkInstance(instanceID);
            const instance = mapInstances.get(instanceID);
            if (promiseLoadingSideModule && promiseLoadingSideModule.isPending) await promiseLoadingSideModule;
            await loadSideModule(body.modules);
            for (let i = 0; i < body.modules.length; i++) {
                if (!Module[`${body.modules[i]}`]) { throw new Error(`'${body.modules[i]}' module load failed.`) }
            }
            const os = JSON.parse(instance.outputSettings(body.templateName));
            bNeedOutputOriginalImage = (os.CaptureVisionTemplates[0].OutputOriginalImage === 1);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            bNeedOutputOriginalImage
        }
        handleTaskRes(taskID, resBody);
    },
    "capture": async (data, body, taskID, instanceID) => {
        await checkAndReauth();
        let intermediateResult;
        let captureResult;
        let bytes;
        log(`time worker get msg: ${Date.now()}`);
        try {
            checkInstance(instanceID);
            const instance = mapInstances.get(instanceID);
            if (promiseInitSetting && promiseInitSetting.isPending) await promiseInitSetting;
            if (cImageData) {
                Module.wasmImports.emscripten_bind_Destory_CImageData(cImageData);
                cImageData = null;
            }
            cImageData = Module.wasmImports.emscripten_bind_Create_CImageData(body.bytes.length, setBufferIntoWasm(body.bytes, 0), body.width, body.height, body.stride, body.format, 0);
            log(`start worker capture: ${Date.now()}`);
            captureResult = instance.capture(cImageData, body.templateName, body.bScanner);
            let t1 = Date.now()
            log(`end worker capture: ${t1}`);
            captureResult = JSON.parse(captureResult, (k, v) => {
                if (bSupportBigInt && k === "format" && BigInt(v) > Number.MAX_SAFE_INTEGER) {
                    return BigInt(v);
                };
                return v;
            });
            let t2 = Date.now()
            log(`capture result parsed: ${t2 - t1}`);
            for (let i = 0; i < captureResult.items.length; i++) {
                if ([EnumCapturedResultItemType.CRIT_NORMALIZED_IMAGE].includes(captureResult.items[i].type)) {
                    bytes = captureResult.items[i].imageData.bytes;
                    bytes = new Uint8Array(new Uint8Array(Module.HEAP8.buffer, bytes.ptr, bytes.length));
                    captureResult.items[i].imageData.bytes = bytes;
                }
            }
            let t3 = Date.now();
            log(`result new Uint8Array: ${t3 - t2}`);
            if (body.bScanner) {
                intermediateResult = JSON.parse(instance.getIntermediateResult(), (k, v) => {
                    if (bSupportBigInt && ["format", "possibleFormats"].includes(k) && BigInt(v) > Number.MAX_SAFE_INTEGER) {
                        return BigInt(v);
                    };
                    return v;
                });
                handleIntermediateResult(intermediateResult);
                captureResult.intermediateResult = intermediateResult;
            }
            let t4 = Date.now();
            log(`get intermediate result: ${t4 - t3}`);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        log(`time worker return msg: ${Date.now()}`);
        parentPort.postMessage({
            type: "task",
            id: taskID,
            body: {
                success: true,
                bytes: body.bytes,
                captureResult
            }
        }, [body.bytes.buffer]);
    },
    "getIntermediateResult": async (data, body, taskID, instanceID) => {
        let intermediateResult = {};
        try {
            const instance = mapInstances.get(instanceID);
            intermediateResult = JSON.parse(instance.getIntermediateResult(), (k, v) => {
                if (bSupportBigInt && ["format", "possibleFormats"].includes(k) && BigInt(v) > Number.MAX_SAFE_INTEGER) {
                    return BigInt(v);
                };
                return v;
            });
            handleIntermediateResult(intermediateResult);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            result: intermediateResult
        }
        handleTaskRes(taskID, resBody);
    },
    "initSettings": async (data, body, taskID, instanceID) => {
        let initSettingsResponse;
        try {
            checkInstance(instanceID);
            const instance = mapInstances.get(instanceID);
            if (promiseLoadingSideModule && promiseLoadingSideModule.isPending) await promiseLoadingSideModule;
            promiseInitSetting = new MutablePromise();
            await loadSideModule(body.modules);
            initSettingsResponse = instance.initSettings(body.settings);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        } finally {
            promiseInitSetting.resolve();
        }
        const resBody = {
            success: true,
            response: initSettingsResponse
        }
        handleTaskRes(taskID, resBody);
    },
    "outputSettings": async (data, body, taskID, instanceID) => {
        let outputSettings;
        try {
            const instance = mapInstances.get(instanceID);
            outputSettings = instance.outputSettings(body.templateName);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            settings: outputSettings
        }
        handleTaskRes(taskID, resBody);
    },
    "getSimplifiedSettings": async (data, body, taskID, instanceID) => {
        let simplifiedSettings;
        try {
            const instance = mapInstances.get(instanceID);
            simplifiedSettings = instance.getSimplifiedSettings(body.templateName);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            settings: simplifiedSettings
        }
        handleTaskRes(taskID, resBody);
    },
    "updateSettings": async (data, body, taskID, instanceID) => {
        let updateSettingsResponse;
        let bNeedOutputOriginalImage;
        try {
            checkInstance(instanceID);
            const instance = mapInstances.get(instanceID);
            let settings = body.settings;
            const templateName = body.templateName;
            if (bSupportBigInt && typeof settings === "object" && settings.hasOwnProperty("barcodeSettings")) {
                settings.barcodeSettings.barcodeFormatIds = settings.barcodeSettings.barcodeFormatIds.toString();
            }
            updateSettingsResponse = instance.updateSettings(templateName, JSON.stringify(settings));
            const os = JSON.parse(instance.outputSettings(templateName));
            bNeedOutputOriginalImage = (os.CaptureVisionTemplates[0].OutputOriginalImage === 1);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            response: updateSettingsResponse,
            bNeedOutputOriginalImage
        }
        handleTaskRes(taskID, resBody);
    },
    "resetSettings": async (data, body, taskID, instanceID) => {
        let resetResponse;
        try {
            checkInstance(instanceID);
            const instance = mapInstances.get(instanceID);
            resetResponse = instance.resetSettings();
            defaultDbrSettings && instance.appendParameterContent(defaultDbrSettings);
            defaultDlrSettings && instance.appendParameterContent(defaultDlrSettings);
            defaultDdnSettings && instance.appendParameterContent(defaultDdnSettings);
            defaultDcpSettings && instance.appendParameterContent(defaultDcpSettings);
            instance.initParameter();
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            response: resetResponse
        }
        handleTaskRes(taskID, resBody);
    },
    "getModuleVersion": async (data, body, taskID, instanceID) => {
        let moduleVersion;
        try {
            moduleVersion = Module.CoreWasm.getVersion();
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            version: moduleVersion
        }
        handleTaskRes(taskID, resBody);
    },
    "enableResultCrossVerification": async (data, body, taskID, instanceID) => {
        let ret;
        try {
            checkInstance(instanceID);
            ret = mapInstances.get(instanceID).enableResultCrossVerification(body.type, body.enabled);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            result: ret
        }
        handleTaskRes(taskID, resBody);
    },
    "enableResultDeduplication": async (data, body, taskID, instanceID) => {
        let ret;
        try {
            checkInstance(instanceID);
            ret = mapInstances.get(instanceID).enableResultDeduplication(body.type, body.enabled);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            result: ret
        }
        handleTaskRes(taskID, resBody);
    },
    "setDuplicateForgetTime": async (data, body, taskID, instanceID) => {
        let ret;
        try {
            checkInstance(instanceID);
            ret = mapInstances.get(instanceID).setDuplicateForgetTime(body.type, body.time);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            result: ret
        }
        handleTaskRes(taskID, resBody);
    },
    "getDuplicateForgetTime": async (data, body, taskID, instanceID) => {
        let time;
        try {
            checkInstance(instanceID);
            time = mapInstances.get(instanceID).getDuplicateForgetTime(body.type);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
            time
        }
        handleTaskRes(taskID, resBody);
    },
    "setIrrRegistry": async (data, body, taskID, instanceID) => {
        try {
            checkInstance(instanceID);
            mapInstances.get(instanceID).setIrrRegistry(JSON.stringify(body.receiverObj));
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
        }
        handleTaskRes(taskID, resBody);
    },
    "setCrrRegistry": async (data, body, taskID, instanceID) => {
        try {
            checkInstance(instanceID);
            mapInstances.get(instanceID).setCrrRegistry(body.receiver);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
        }
        handleTaskRes(taskID, resBody);
    },
    "consumeForDce": async (data, body, taskID, instanceID) => {
        try {
            Module.CoreWasm.consumeForDce(body.count)
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
        }
        handleTaskRes(taskID, resBody);
    },
    "setThresholdValue": async (data, body, taskID, instanceID) => {
        try {
            mapInstances.get(instanceID).setThresholdValue(body.threshold, body.leftLimit, body.rightLimit);
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
        }
        handleTaskRes(taskID, resBody);
    },
    "clearVerifyList": async (data, body, taskID, instanceID) => {
        try {
            mapInstances.get(instanceID).clearVerifyList();
        } catch (ex) {
            handleTaskErr(taskID, ex);
            return;
        }
        const resBody = {
            success: true,
        }
        handleTaskRes(taskID, resBody);
    }
};