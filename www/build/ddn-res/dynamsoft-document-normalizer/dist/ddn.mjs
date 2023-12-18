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
import{engineResourcePaths as d,workerAutoResources as e,mapPackageRegister as n,innerVersions as t}from"@dynamsoft/dynamsoft-core";const r="undefined"==typeof self,s=(()=>{if(!r&&document.currentScript){let d=document.currentScript.src,e=d.indexOf("?");if(-1!=e)d=d.substring(0,e);else{let e=d.indexOf("#");-1!=e&&(d=d.substring(0,e))}return d.substring(0,d.lastIndexOf("/")+1)}return"./"})();d.ddn=s,e.ddn={js:!1,wasm:!0},n.ddn={};class o{static getVersion(){const d=t.ddn&&t.ddn.wasm,e=t.ddn&&t.ddn.worker;return`2.0.12-dev-20231215173500(Worker: ${e||"Not Loaded"}, Wasm: ${d||"Not Loaded"})`}}export{o as DocumentNormalizerModule};
