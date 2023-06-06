import { newE2EPage } from '@stencil/core/testing';

describe('image-cropper', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<image-cropper></image-cropper>');

    const element = await page.find('image-cropper');
    expect(element).toHaveClass('hydrated');
  });
});
