import { Component, Host, Prop, State, Watch, h } from '@stencil/core';

@Component({
  tag: 'image-cropper',
  styleUrl: 'image-cropper.css',
  shadow: true,
})
export class ImageCropper {
  @Prop() img?: HTMLImageElement;
  @State() viewBox:string = "0 0 1280 720";
  @Watch('img')
  watchPropHandler(newValue: HTMLImageElement) {
    if (newValue) {
      this.viewBox = "0 0 "+newValue.naturalWidth+" "+newValue.naturalHeight;
    }
  }
  render() {
    return (
      <Host>
        <svg 
          version="1.1" 
          xmlns="http://www.w3.org/2000/svg"
          viewBox={this.viewBox}
        >
          <image href={this.img ? this.img.src : ""}></image>
        </svg>
        <slot></slot>
      </Host>
    );
  }

}
