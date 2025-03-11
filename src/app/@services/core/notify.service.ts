import { Injectable } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { Subject } from 'rxjs';

class MessagesSubject {
  public type: string = '';
  public messages: any;
}

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  private messages = new Subject<MessagesSubject>();

  constructor() {
    this.messages.subscribe((data) => {
      let simpleMessage =
        data?.messages?.detail ?? data?.messages?.message ?? null;
      let safeHtml =
        simpleMessage ??
        `<div class='dx-toast-template'>${this.buildHtmlMessages(
          data.messages
        )}</div>`;
      notify(
        {
          contentTemplate: safeHtml,
          width: 300,
          minWidth: 300,
          type: data.type,
          displayTime: 3000,
          animation: {
            show: {
              type: 'fade',
              duration: 400,
              from: 0,
              to: 1,
            },
            hide: { type: 'fade', duration: 40, to: 0 },
          },
        },
        { position: 'top right', direction: 'down-stack' }
      );
    });
  }

  public getMessages() {
    return this.messages.asObservable();
  }
  public sucess(messages: any) {
    this.messages.next({ type: 'success', messages: messages });
  }
  public error(messages: any) {
    this.messages.next({ type: 'error', messages: messages });
  }
  public warning(messages: any) {
    this.messages.next({ type: 'warning', messages: messages });
  }
  public info(messages: any) {
    this.messages.next({ type: 'info', messages: messages });
  }

  private buildHtmlMessages(
    messages: any,
    open: string = '<span>',
    close: string = '</span>',
    key: string = ''
  ) {
    if (typeof messages === 'string') {
      console.log(messages);
      return `${open}<strong> ${key} </strong> ${messages} ${close}`;
    }
    if (Array.isArray(messages)) {
      console.log(messages);
      let inner = '';
      for (const message of messages) {
        inner += this.buildHtmlMessages(message, '<li>', '</li>', key);
      }
      return inner;
    }
    if (typeof messages === 'object') {
      let inner = '';
      Object.entries(messages).forEach(([key, value]) => {
        inner += ` <ul>${this.buildHtmlMessages(
          value,
          '<li>',
          '</li>',
          key
        )}</ul>`;
      });
      return inner;
    }
    return 'Error no identificado';
  }
}
