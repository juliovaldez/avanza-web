import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { DxToastModule } from 'devextreme-angular';
import { NotifyService } from '@services/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [DxToastModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  public type: string = 'toast';
  public isVisible: boolean = false;
  public safeHtml: SafeHtml = '';

  @ViewChild('container', { read: ElementRef }) container!: ElementRef;
  constructor(
    private notifyService: NotifyService,
    private sanitizer: DomSanitizer,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.notifyService.getMessages().subscribe((data) => {
      return;
      console.log(data);
      this.type = data.type;
      this.safeHtml = this.buildHtmlMessages(data.messages);
      notify(
        {
          contentTemplate: this.safeHtml,
          width: 300,
          shading: true,
          position: 'top right',
          direction: 'down-push',
        },
        'error',
        5000
      );
      notify(
        {
          message: 'probando',
          width: 300,
          shading: true,
          position: 'top left',
          direction: 'down-push',
        },
        'success',
        5000
      );
      // this.isVisible = true;
    });
  }

  private buildHtmlMessages(
    messages: any,
    open: string = '<span>',
    close: string = '</span>'
  ) {
    if (typeof messages === 'string') {
      console.log(messages);
      return `${open}<strong> ${messages} </strong> ${close}`;
    }
    if (Array.isArray(messages)) {
      console.log(messages);
      let inner = '';
      for (const message of messages) {
        inner += this.buildHtmlMessages(message, '<li>', '</li>');
      }
      return inner;
    }
    if (typeof messages === 'object') {
      let inner = '';
      Object.entries(messages).forEach(([key, value]) => {
        inner += `<ul >${this.buildHtmlMessages(value, '<li>', '</li>')}</ul>`;
      });
      return inner;
    }
    return 'Error no identificado';
  }
}
