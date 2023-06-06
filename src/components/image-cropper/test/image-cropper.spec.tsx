import { newSpecPage } from '@stencil/core/testing';
import { ImageCropper } from '../image-cropper';

describe('image-cropper', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ImageCropper],
      html: `<image-cropper></image-cropper>`,
    });
    expect(page.root).toEqualHtml(`
      <image-cropper>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </image-cropper>
    `);
  });
});
