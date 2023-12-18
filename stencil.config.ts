import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'image-cropper-component',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: '../ddn-res', warn: true }
      ]
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
      copy: [
        {
          src: '../ddn-res',
          dest: 'build/ddn-res',
          warn: true,
        }
      ]
    },
  ],
};
