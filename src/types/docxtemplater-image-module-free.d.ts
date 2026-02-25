/**
 * docxtemplater-image-module-free 类型声明
 */

declare module "docxtemplater-image-module-free" {
  interface ImageModuleOptions {
    centered?: boolean;
    getImage: (tag: string) => any;
    getSize: (img: any, tag: string, value: any) => [number, number];
  }

  class ImageModule {
    constructor(options: ImageModuleOptions);
  }

  export = ImageModule;
}
