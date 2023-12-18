
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function () {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function (array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function (array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}

Module["ensureString"] = ensureString;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}

Module["ensureCache"] = ensureCache;

// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function () {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// CoreWasm
/** @suppress {undefinedVars, duplicate} @this{Object} */function CoreWasm(config) {
  ensureCache.prepare();
  if (config && typeof config === 'object') config = config.ptr;
  else config = ensureString(config);
  this.ptr = _emscripten_bind_CoreWasm_CoreWasm_1(config);
  getCache(CoreWasm)[this.ptr] = this;
};;
CoreWasm.prototype = Object.create(WrapperObject.prototype);
CoreWasm.prototype.constructor = CoreWasm;
CoreWasm.prototype.__class__ = CoreWasm;
CoreWasm.__cache__ = {};
Module['CoreWasm'] = CoreWasm;

Module['CoreWasm'].init = /** @suppress {undefinedVars, duplicate} @this{Object} */function (strCfg) {
  ensureCache.prepare();
  strCfg = ensureString(strCfg);
  return Module.wasmImports.emscripten_bind_CoreWasm_static_init_1(strCfg);
};

Module['CoreWasm'].getIsSupportDceModule = /** @suppress {undefinedVars, duplicate} @this{Object} */function () {
  return Module.wasmImports.emscripten_bind_CoreWasm_static_GetIsSupportDceModule_0();
};

Module['CoreWasm'].getIsSupportIRTModule = /** @suppress {undefinedVars, duplicate} @this{Object} */function () {
  return Module.wasmImports.emscripten_bind_CoreWasm_static_GetIsSupportIRTModule_0();
};

Module['CoreWasm'].consumeForDce = /** @suppress {undefinedVars, duplicate} @this{Object} */function (count) {
  return Module.wasmImports.emscripten_bind_CoreWasm_static_ConsumeForDce_1(count);
};

Module['CoreWasm'].getVersion = /** @suppress {undefinedVars, duplicate} @this{Object} */function (count) {
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CoreWasm_GetModuleVersion_0());
};

CoreWasm.prototype['__destroy__'] = CoreWasm.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function () {
  var self = this.ptr;
  Module.wasmImports.emscripten_bind_CoreWasm___destroy___0(self);
};

// DynamsoftCoreWasm
function DynamsoftCoreWasm() {
  this.ptr = Module.wasmImports.emscripten_bind_CvrWasm_CvrWasm_0();
  Module.getCache(DynamsoftCoreWasm)[this.ptr] = this;
};
DynamsoftCoreWasm.prototype = Object.create(Module.WrapperObject.prototype);
DynamsoftCoreWasm.prototype.constructor = DynamsoftCoreWasm;
DynamsoftCoreWasm.prototype.__class__ = DynamsoftCoreWasm;
DynamsoftCoreWasm.__cache__ = {};
Module['DynamsoftCoreWasm'] = DynamsoftCoreWasm;

DynamsoftCoreWasm.prototype.appendParameterContent = function (content) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (content && typeof content === 'object') content = content.ptr;
  else content = Module.ensureString(content);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_AppendParameterContent_1(self, content));
};

DynamsoftCoreWasm.prototype.initParameter = function () {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_InitParameter_0(self));
};

DynamsoftCoreWasm.prototype.initSettings = function (content) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (content && typeof content === 'object') content = content.ptr;
  else content = Module.ensureString(content);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_InitSettings_1(self, content));
};

DynamsoftCoreWasm.prototype.resetSettings = function () {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_ResetSettings_0(self));
};

DynamsoftCoreWasm.prototype.outputSettings = function (templateName) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (templateName && typeof templateName === 'object') templateName = templateName.ptr;
  else templateName = Module.ensureString(templateName);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_OutputSettings_1(self, templateName));
};

DynamsoftCoreWasm.prototype.__destroy__ = function () {
  var self = this.ptr;
  Module.wasmImports.emscripten_bind_CvrWasm___destroy___0(self);
};

DynamsoftCoreWasm.prototype.capture = function (cImageData, templateName, bScanner) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (templateName && typeof templateName === 'object') templateName = templateName.ptr;
  else templateName = Module.ensureString(templateName);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_Capture_3(self, cImageData, templateName, bScanner));
};

DynamsoftCoreWasm.prototype.getIntermediateResult = function () {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_GetIntermediateResult_0(self));
};

DynamsoftCoreWasm.prototype.getSimplifiedSettings = function (templateName) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (templateName && typeof templateName === 'object') templateName = templateName.ptr;
  else templateName = Module.ensureString(templateName);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_GetSimplifiedSettings_1(self, templateName));
};

DynamsoftCoreWasm.prototype.updateSettings = function (templateName, content) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (templateName && typeof templateName === 'object') templateName = templateName.ptr;
  else templateName = Module.ensureString(templateName);
  if (content && typeof content === 'object') content = content.ptr;
  else content = Module.ensureString(content);
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_UpdateSettings_2(self, templateName, content));
};

DynamsoftCoreWasm.prototype.enableResultCrossVerification = function (type, enabled) {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_EnableResultCrossVerification_2(self, type, enabled));
};

DynamsoftCoreWasm.prototype.enableResultDeduplication = function (type, enabled) {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_EnableResultDeduplication_2(self, type, enabled));
};

DynamsoftCoreWasm.prototype.setDuplicateForgetTime = function (type, time) {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_SetDuplicateForgetTime_2(self, type, time));
};

DynamsoftCoreWasm.prototype.getDuplicateForgetTime = function (type) {
  var self = this.ptr;
  return Module.UTF8ToString(Module.wasmImports.emscripten_bind_CvrWasm_GetDuplicateForgetTime_1(self, type));
};

DynamsoftCoreWasm.prototype.setIrrRegistry = function (receiverObj) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (receiverObj && typeof receiverObj === 'object') receiverObj = receiverObj.ptr;
  else receiverObj = Module.ensureString(receiverObj);
  Module.wasmImports.emscripten_bind_CvrWasm_SetIrrRegistry_1(self, receiverObj);
};

DynamsoftCoreWasm.prototype.setCrrRegistry = function (receiverObj) {
  var self = this.ptr;
  Module.ensureCache.prepare();
  if (receiverObj && typeof receiverObj === 'object') receiverObj = receiverObj.ptr;
  else receiverObj = Module.ensureString(receiverObj);
  Module.wasmImports.emscripten_bind_CvrWasm_SetCrrRegistry_1(self, receiverObj);
};

DynamsoftCoreWasm.prototype.setThresholdValue = function (threshold, leftLimit, rightLimit) {
  var self = this.ptr;
  Module.wasmImports.emscripten_bind_CvrWasm_SetThresholdValue_3(self, threshold, leftLimit, rightLimit);
};

DynamsoftCoreWasm.prototype.clearVerifyList = function () {
  var self = this.ptr;
  Module.wasmImports.emscripten_bind_CvrWasm_ClearVerifyList_0(self);
};