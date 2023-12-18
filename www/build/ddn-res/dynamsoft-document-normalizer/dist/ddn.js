/*!
* Dynamsoft JavaScript Library
* @product Dynamsoft Document Normalizer JS Edition
* @website http://www.dynamsoft.com
* @copyright Copyright 2023, Dynamsoft Corporation
* @author Dynamsoft
* @version 2.0.12-dev-20231215173500
* @fileoverview Dynamsoft JavaScript Library for Document Normalizer
* More info on ddn JS: https://www.dynamsoft.com/document-normalizer/sdk-javascript/
*/
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports,require("@dynamsoft/dynamsoft-core")):"function"==typeof define&&define.amd?define(["exports","@dynamsoft/dynamsoft-core"],n):n(((e="undefined"!=typeof globalThis?globalThis:e||self).Dynamsoft=e.Dynamsoft||{},e.Dynamsoft.DDN={}),e.Dynamsoft.Core)}(this,(function(e,n){"use strict";const s="undefined"==typeof self,t=(()=>{if(!s&&document.currentScript){let e=document.currentScript.src,n=e.indexOf("?");if(-1!=n)e=e.substring(0,n);else{let n=e.indexOf("#");-1!=n&&(e=e.substring(0,n))}return e.substring(0,e.lastIndexOf("/")+1)}return"./"})();n.engineResourcePaths.ddn=t,n.workerAutoResources.ddn={js:!1,wasm:!0},n.mapPackageRegister.ddn={};e.DocumentNormalizerModule=class{static getVersion(){const e=n.innerVersions.ddn&&n.innerVersions.ddn.wasm,s=n.innerVersions.ddn&&n.innerVersions.ddn.worker;return`2.0.12-dev-20231215173500(Worker: ${s||"Not Loaded"}, Wasm: ${e||"Not Loaded"})`}},Object.defineProperty(e,"__esModule",{value:!0})}));
