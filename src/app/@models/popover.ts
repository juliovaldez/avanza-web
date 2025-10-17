
export interface IPopoverConf {

  popoverVisible: boolean;
  popoverTarget: any;
  popoverData: any;

}

export class PopoverConf implements IPopoverConf {
  popoverVisible = false;
  popoverTarget: any = null;
  popoverData: any = null;

  constructor() { }

  showPopover(event: MouseEvent, cellInfo: any) {
    this.popoverTarget = event.target;
    this.popoverData = cellInfo.data;
    this.popoverVisible = true;
  }
  hidePopover() {
    this.popoverVisible = false;
  }
}
