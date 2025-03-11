import { Injectable } from '@angular/core';

export class widthsSpan {
  constructor(
    public width: string | number = '100%',
    public options: Options = new Options()
  ) {}
}
export class Options {
  sm: string | number = '100%';
  xs: string | number = '100%';
  md: string | number = '100%';
  lg: string | number = '100%';
  xl: string | number = '100%';
  xxl: string | number = '100%';

  constructor(options: Options | Object = {}) {
    Object.assign(this, options);
  }
}
@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  constructor() {}

  makeObserver(dialogConfig: widthsSpan) {
    return new ResizeObserver(() => {
      dialogConfig.width = this.screenResponsive(dialogConfig.options);
      console.log(dialogConfig.width);
    }).observe(document.body);
  }
  private screenResponsive(widthsSpan: Options = new Options()) {
    const screenWidth = window.innerWidth;
    let widthSpan: string | number = '100%';
    switch (true) {
      case screenWidth >= 1400:
        widthSpan = widthsSpan.xxl;
        break;
      case screenWidth >= 1200:
        widthSpan = widthsSpan.xl;
        break;
      case screenWidth >= 992:
        widthSpan = widthsSpan.lg;
        break;
      case screenWidth >= 768:
        widthSpan = widthsSpan.md;
        break;
      case screenWidth >= 576:
        widthSpan = widthsSpan.sm;
        break;
      case screenWidth < 576:
        widthSpan = widthsSpan.xs;
        break;
    }
    return widthSpan;
  }
}
