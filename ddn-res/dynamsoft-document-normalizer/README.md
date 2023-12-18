# Dynamsoft Document Normalizer JavaScript Edition User Guide

With Dynamsoft Document Normalizer JavaScript edition, you can add to your website the ability to take pictures of documents with your camera and normalize them to obtain high-quality images for further processing or archiving purposes.

> Dynamsoft Document Normalizer v2.0.11 and above is based on Dynamsoft Capture Vision Architecture. To learn more, read [Introduction to Dynamsoft Capture Vision](https://www.dynamsoft.com/capture-vision/docs/core/introduction/).

In this guide, you'll learn step-by-step how to build such a simple solution in a web page.

<span style="font-size:20px">Table of Contents</span>

- [Dynamsoft Document Normalizer JavaScript Edition User Guide](#dynamsoft-document-normalizer-javascript-edition-user-guide)
  - [Getting started](#getting-started)
    - [About the code](#about-the-code)
    - [Test the code](#test-the-code)
  - [Building your own page](#building-your-own-page)
    - [Include the SDK](#include-the-sdk)
      - [Use a CDN](#use-a-cdn)
      - [Host the SDK yourself](#host-the-sdk-yourself)
    - [Define necessary HTML elements](#define-necessary-html-elements)
    - [Prepare the SDK for the task](#prepare-the-sdk-for-the-task)
    - [Define the functions](#define-the-functions)
      - [Start the detection](#start-the-detection)
      - [Review and adjust a found boundary](#review-and-adjust-a-found-boundary)
      - [Normalize a document based on its adjusted boundary](#normalize-a-document-based-on-its-adjusted-boundary)
  - [System requirements](#system-requirements)
  - [Release notes](#release-notes)
  - [Next steps](#next-steps)

## Getting started

The solution consists of two steps

1. Detect the document boundaries
2. Normalize the document based on the detected boundaries

The following sample code sets up the SDK and implements boundary detection on a web page, which is just the first step in capturing a normalized image of your document. We'll cover the second step later in [Building Your Own Page](#building-your-own-page).

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-core@3.0.10/dist/core.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-utility@1.0.10/dist/utility.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@2.0.11/dist/ddn.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.11/dist/cvr.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.0/dist/dce.js"></script>
</head>

<body>
    <h1>Detect the Boundary of the Document</h1>
    <button onclick="startDetection()">Start Detection</button>
    <div id="cameraViewContainer" style="width: 50vw; height: 45vh; margin-top: 10px; display: none"></div>

    <script>
        const cameraViewContainer = document.querySelector(
            "#cameraViewContainer"
        );
        let router;
        let cameraEnhancer;
        Dynamsoft.License.LicenseManager.initLicense(
                "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9"
        );
        Dynamsoft.CVR.CaptureVisionRouter.preloadModule(["DDN"]);

        (async function() {
            router = await Dynamsoft.CVR.CaptureVisionRouter.createInstance();
            let view = await Dynamsoft.DCE.CameraView.createInstance();
            cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance(
                view
            );
            cameraViewContainer.append(view.getUIElement());
            router.setInput(cameraEnhancer);
        })();
        async function startDetection() {
            cameraViewContainer.style.display = "block";
            await cameraEnhancer.open();
            await router.startCapturing("detect-document-boundaries");
        }
    </script>
</body>

</html>
```

<!--
<p align="center" style="text-align:center; white-space: normal; ">
  <a target="_blank" href="https://jsfiddle.net/DynamsoftTeam/5vgh7rdx/" title="Run via JSFiddle">
    <img src="https://cdn.jsdelivr.net/npm/simple-icons@3.0.1/icons/jsfiddle.svg" alt="Run via JSFiddle" width="20" height="20" style="width:20px;height:20px;">
  </a>
</p>
-->

-----

### About the code

- `Dynamsoft.CVR.LicenseManager.initLicense()`: initializes the license using a license key string.

- `Dynamsoft.CVR.CaptureVisionRouter.preloadModule(["DDN"])`: preloads the `DocumentNormalizer` module, saving time in preparing for document border detection and image normalization.

- `Dynamsoft.CVR.CaptureVisionRouter.createInstance()`: initializes the `router` variable by creating an instance of the `CaptureVisionRouter` class. An instance of `CaptureVisionRouter` is the core of any solution based on Dynamsoft Capture Vision architecture.

  > Read more on [what is CaptureVisionRouter](https://www.dynamsoft.com/capture-vision/docs/core/architecture/#capture-vision-router)

- `Dynamsoft.DCE.CameraEnhancer.createInstance(view)`: initializes the `cameraEnhancer` variable by creating an instance of the `CameraEnhancer` class.

- `setInput()`: sets `cameraEnhancer` as the image source to `router`.

  > In some cases, a different camera might be required instead of the default one. Also, a different resolution might work better. To change the camera or the resolution, use the `CameraEnhancer` instance `cameraEnhancer`. Learn more [here](https://www.dynamsoft.com/camera-enhancer/docs/programming/javascript/api-reference/camera-control.html?ver=4.0.0&utm_source=guide&product=ddn&package=js).

- `startCapturing("detect-document-boundaries")` : starts to run images through a pre-defined process which, in the case of "detect-document-boundaries", tries to find the boundary of a document present in the image(s).

### Test the code

Create a text file called "Detect-A-Document-Boundary.html", fill it with the code above and save it. After that, open the example page in your browser, allow the page to access your camera, and the video will be displayed on the page. Afterwards, you will see the detected boundaries displayed on the video in real time.

> NOTE:
> 
> The sample code requires the following to run:
> 
> 1. Internet connection
> 2. [A supported browser](#system-requirements)
> 3. An accessible Camera

Please note:

- Although the page should work properly when opened directly as a file ("file:///"), it's recommended that you deploy it to a web server and access it via HTTPS.
- On first use, you need to wait a few seconds for the SDK to initialize.
- The license "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" used in this sample is an online license good for 24 hours and requires network connection to work. To test the SDK further, you can request a 30-day trial license via the [customer portal](https://www.dynamsoft.com/customer/license/trialLicense?utm_source=guide&architecture=dcv&product=ddn&package=js).

<!-- You can also just test it at [https://jsfiddle.net/DynamsoftTeam/]()-->

If the test doesn't go as expected, you can [contact us](https://www.dynamsoft.com/company/customer-service/#contact).

## Building your own page

In this section, we'll break down and show all the steps needed to build the solution in a web page.

We'll build on this skeleton page:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
    <h1>Detect the Boundary of the Document and Normalize it</h1>
    <script>
      // Write your code here.
    </script>
</body>
</html>
```

### Include the SDK

To build the solution, we need to include five packages

1. `dynamsoft-core`: Required, it includes basic classes, interfaces, and enumerations that are shared between all Dynamsoft SDKs.
2. `dynamsoft-utility`: Optional, it defines auxiliary classes shared between all Dynamsoft SDKs.
3. `dynamsoft-document-normalizer`: Required, it provides functions to detect boundaries or perform normalization.
4. `dynamsoft-capture-vision-router`: Required, it defines the class `CaptureVisionRouter`, which controls the whole process.
5. `dynamsoft-camera-enhancer`: Recommended, it provides the ability to capture images from video stream.

#### Use a CDN

The simplest way to include the SDK is to use either the [jsDelivr](https://jsdelivr.com/) or [UNPKG](https://unpkg.com/) CDN.

- jsDelivr

  ```html
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-core@3.0.10/dist/core.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-utility@1.0.10/dist/utility.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@2.0.11/dist/ddn.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.11/dist/cvr.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.0/dist/dce.js"></script>
  ```

- UNPKG

  ```html
  <script src="https://unpkg.com/dynamsoft-core@3.0.10/dist/core.js"></script>
  <script src="https://unpkg.com/dynamsoft-utility@1.0.10/dist/utility.js"></script>
  <script src="https://unpkg.com/dynamsoft-document-normalizer@2.0.11/dist/ddn.js"></script>
  <script src="https://unpkg.com/dynamsoft-capture-vision-router@2.0.11/dist/cvr.js"></script>
  <script src="https://unpkg.com/dynamsoft-camera-enhancer@4.0.0/dist/dce.js"></script>
  ```

#### Host the SDK yourself

Besides using the CDN, you can also download the SDK and host its files on your own website / server before including it in your application.

Options to download the SDK:

- From the website

  [Download the JavaScript ZIP package](https://www.dynamsoft.com/document-normalizer/downloads/?ver=2.0.11&utm_source=guide)

- yarn

  ```cmd
  yarn add dynamsoft-capture-vision-router@2.0.11
  ```

- npm

  ```cmd
  npm install dynamsoft-capture-vision-router@2.0.11
  ```

> Note: Upon installation of `dynamsoft-capture-vision-router`, the compatible versions of `dynamsoft-document-normalizer` and `dynamsoft-core` will be automatically downloaded.

Depending on how you downloaded the SDK and where you put it, you can typically include it like this:

  ```html
  <!-- Upon extracting the zip package into your project, you can generally include it in the following manner -->
  <script src="./dynamsoft-document-normalizer-js-2.0.11/dynamsoft/distributables/dynamsoft-core@3.0.10/dist/core.js"></script>
  <script src="./dynamsoft-document-normalizer-js-2.0.11/dynamsoft/distributables/dynamsoft-utility@1.0.10/dist/utility.js"></script>
  <script src="./dynamsoft-document-normalizer-js-2.0.11/dynamsoft/distributables/dynamsoft-document-normalizer@2.0.11/dist/ddn.js"></script>
  <script src="./dynamsoft-document-normalizer-js-2.0.11/dynamsoft/distributables/dynamsoft-capture-vision-router@2.0.11/dist/cvr.js"></script>
  <script src="./dynamsoft-document-normalizer-js-2.0.11/dynamsoft/distributables/dynamsoft-camera-enhancer@4.0.0/dist/dce.js"></script>
  ```

or

  ```html
  <script src="./node_modules/dynamsoft-core/dist/core.js"></script>
  <script src="./node_modules/dynamsoft-utility/dist/utility.js"></script>
  <script src="./node_modules/dynamsoft-document-normalizer/dist/ddn.js"></script>
  <script src="./node_modules/dynamsoft-capture-vision-router/dist/cvr.js"></script>
  <script src="./node_modules/dynamsoft-camera-enhancer/dist/dce.js"></script>
  ```

### Define necessary HTML elements

For this solution, we define two buttons and three `<div>` elements.

```html
<button onclick="startDetection()">Start Detection</button>
<button id="btn_normalize" onclick="normalizeImage()" disabled>Normalize Image</button>
<div id="cameraViewContainer" style="width: 50vw; height: 45vh; margin-top: 10px; display: none"></div>
<div id="imageEditorViewContainer" style="width: 80vw; height: 50vh"></div>
<div id="normalizedImageContainer"></div>
```

```js
const cameraViewContainer = document.querySelector(
    "#cameraViewContainer"
);
const imageEditorViewContainer = document.querySelector(
    "#imageEditorViewContainer"
);
const normalizedImageContainer = document.querySelector(
    "#normalizedImageContainer"
);
```

### Prepare the SDK for the task

The following function executes as soon as the page loads to get the SDK prepared:

```js
let router;
let cameraEnhancer;
let imageEditorView;
Dynamsoft.License.LicenseManager.initLicense(
    "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9"
);
Dynamsoft.CVR.CaptureVisionRouter.preloadModule(["DDN"]);

(async function() {
    router = await Dynamsoft.CVR.CaptureVisionRouter.createInstance();
    let view = await Dynamsoft.DCE.CameraView.createInstance();
    cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance(
        view
    );
    cameraViewContainer.append(view.getUIElement());
    router.setInput(cameraEnhancer);
})();
```

The code was explained earlier. Please refer to [About the Code](#about-the-code).

### Define the functions

#### Start the detection

Before we start the detection process with `startDetection()`, we need to define a callback function to accept the detected document boundaries. The callback function is defined based on the `CapturedResultReceiver` interface.

> Read more on [`CapturedResultReceiver`](https://www.dynamsoft.com/capture-vision/docs/web/programming/javascript/api-reference/core/basic-structures/captured-result-receiver.html)

```js
const resultReceiver = new Dynamsoft.CVR.CapturedResultReceiver();
resultReceiver.onDetectedQuadsReceived = (result) => {
    items = result.quadsResultItems;
    console.log(items);
};
```

And we define the function like this:

```js
async function startDetection() {
    // Shows the cameraView
    cameraViewContainer.style.display = "block";
    // Specifies the result receiver
    router.addResultReceiver(resultReceiver);
    // Starts streaming the video
    await cameraEnhancer.open();
    // Uses the built-in template "detect-document-boundaries" to start a boundary detecting task
    await router.startCapturing("detect-document-boundaries");
}
```

The steps of the workflow is as follows

1. `cameraEnhancer` streams the video, captures live video frames and stores them in a buffer.
2. `router` gets the video frames from `cameraEnhancer` and passes them to be processed by an internal `DocumentNormalizer` instance.
3. The internal `DocumentNormalizer` instance returns the found document boundaries, known as `quadsResultItems`, to `router`.
4. `router` outputs the `quadsResultItems` via the callback function `onDetectedQuadsReceived`.

> Also note that the `quadsResultItems` are drawn over the video automatically to show the detection in action.

#### Review and adjust a found boundary

The SDK tries to find the boundary of the document in each and every image processed. This happens very fast and we don't always get the perfect boundary for normalization. Therefore, we can draw the image and the boundary in the `ImageEditorView` and let the user adjust the boundary before proceed to normalization.

To do this, we define the function `editBoundary()` like this

```js
async function editBoundary(imageData, points) {
    // Stops the previous detecting task since we assume we have found a good boundary.
    router.stopCapturing();
    // Creates an ImageEditorView inside the div "imageEditorViewContainer".
    if (imageEditorView == undefined) {
        imageEditorView = await Dynamsoft.DCE.ImageEditorView.createInstance(
            imageEditorViewContainer
        );
    }
    // Creates a drawinglayer to draw the document boundary (quad).
    let layer;
    if (imageEditorView.getAllDrawingLayers().length > 0)
        layer = imageEditorView.getAllDrawingLayers()[0];
    else layer = imageEditorView.createDrawingLayer();
    // Hides the cameraView and show the imageEditorView.
    cameraViewContainer.style.display = "none";
    imageEditorViewContainer.style.display = "block";
    // Draws the image in the imageEditorView first.
    imageEditorView.setOriginalImage(imageData);
    // Draws the document boundary (quad).
    const quad = new Dynamsoft.DCE.DrawingItem.QuadDrawingItem({
        points,
    });
    layer.setDrawingItems([quad]);
    document.getElementById("btn_normalize").disabled = false;
}
```

Since we will need the original image returned, we update `startDetection()` like this:

```js
async function startDetection() {
    cameraViewContainer.style.display = "block";
    router.addResultReceiver(resultReceiver);
    await cameraEnhancer.open();
    // Updates the settings for "detect-document-boundaries" to return the original image.
    let settings = await router.getSimplifiedSettings(
        "detect-document-boundaries"
    );
    settings.capturedResultItemTypes +=
        Dynamsoft.Core.EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
    await router.updateSettings("detect-document-boundaries", settings);
    await router.startCapturing("detect-document-boundaries");
};
```

Then we update the callback function to do 2 things:

1. Determine whether a found boundary is good by counting consecutive frames with results. Here we set 30 as the threshold.
   
  > Alternatively, the quality of the boundary can be judged in a few other ways:
  > * With its property `confidenceAsDocumentBoundary`.
  > * With a result filter such as a `MultiFrameResultCrossFilter`.

2. If a good boundary is found, carry on to invoke the function `editBoundary()`.
  > Note that in order to get both the boundary result and the original image, we have changed the callback function from `onDetectedQuadsReceived` to `onCapturedResultReceived`.

```js
resultReceiver.onCapturedResultReceived = (result) => {
    /* Saves the image data of the current frame for subsequent image editing. */
    let image = result.items.filter((item) => item.type === 1)[0].imageData;
    if (result.items.length <= 1) {
        frameCount = 0;
        return;
    }
    frameCount++;
    if (frameCount === 30) {
        frameCount = 0;
        editBoundary(image, result.items[1].location.points);
    }
};
```

Now, the behavior will be

1. The page constantly detect the boundary of the document in the video.
2. When the found boundary in 30 consecutive image frames, the page hides the video stream and draw both the image and the boundary in the "imageEditorViewer".
3. The user can adjust the boundary to be more precise.

#### Normalize a document based on its adjusted boundary

After the user has adjusted the boundary or determined that the found boundary is good enough, he can press the button "Normalize Image" to carry out the normalization as the last step of the solution.

The function `normalizeImage()` is defined like this:

```js
async function normalizeImage() {
    // Hides the imageEditorView
    imageEditorViewContainer.style.display = "none";
    // Removes the old normalized image if any
    normalizedImageContainer.innerHTML = "";
    // Gets the boundary from the imageEditorView
    let boundaryQuad = null;
    if (imageEditorView == undefined) {
        document.getElementById("btn_normalize").disabled = true;
        return;
    }
    let seletedItems = imageEditorView.getSelectedDrawingItems();
    if (seletedItems.length == 0) {
        let layer = imageEditorView.getAllDrawingLayers()[0];
        boundaryQuad = layer.getDrawingItems()[0];
    } else {
        boundaryQuad = seletedItems[0];
    }
    // Gets the original image to normalize
    let originalImage = imageEditorView.getOriginalImage();
    await router.resetSettings();
    let quad = boundaryQuad.getQuad();
    // Updates the template "normalize-document" with the boundary
    let newSettings = await router.getSimplifiedSettings(
        "normalize-document"
    );
    newSettings.roi.points = quad.points;
    newSettings.roiMeasuredInPercentage = 0;
    await router.updateSettings("normalize-document", newSettings);
    // Normalizes and show the result image
    let normalizeResult = await router.capture(
        originalImage,
        "normalize-document"
    );
    normalizedImageContainer.append(normalizeResult.items[0].toCanvas());
    document.getElementById("btn_normalize").disabled = true;
}
```

The added behavior is

1. The user hits "Normalize Image"
2. The page gets the boundary normalize the image based on it
3. The normalized image shows up on the page

## System requirements

The SDK requires the following features to work:

- Secure context (HTTPS deployment)

  When deploying your application / website for production, make sure to serve it via a secure HTTPS connection. This is required for two reasons
  
  - Access to the camera video stream is only granted in a security context. Most browsers impose this restriction.
  > Some browsers like Chrome may grant the access for `http://127.0.0.1` and `http://localhost` or even for pages opened directly from the local disk (`file:///...`). This can be helpful for temporary development and test.
  
  - Dynamsoft License requires a secure context to work.

- `WebAssembly`, `Blob`, `URL`/`createObjectURL`, `Web Workers`

  The above four features are required for the SDK to work.

The following table is a list of supported browsers based on the above requirements:

  | Browser Name |             Version              |
  | :----------: | :------------------------------: |
  |    Chrome    |             v69+                 |
  |   Firefox    |             v62+                 |
  |    Safari    |             v15+                 |
  |     Edge     |             v79+                 |

Apart from the browsers, the operating systems may impose some limitations of their own that could restrict the use of the SDK.

## Release notes

Learn what are included in each release at [https://www.dynamsoft.com/document-normalizer/docs/programming/javascript/release-notes/?ver=latest](https://www.dynamsoft.com/document-normalizer/docs/programming/javascript/release-notes/?ver=latest).

## Next steps

Now that you have got the SDK integrated, you can choose to move forward in the following directions

1. Check out the [official samples](https://github.com/Dynamsoft/document-normalizer-javascript-samples).
2. Learn about the available [APIs](https://www.dynamsoft.com/document-normalizer/docs/web/programming/javascript/api-reference/?ver=latest).
