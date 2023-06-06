import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'image-cropper',
  styleUrl: 'image-cropper.css',
  shadow: true,
})
export class ImageCropper {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
