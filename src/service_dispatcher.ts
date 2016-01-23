/// <reference path="../typings/node/node.d.ts" />
import {EventEmitter} from 'events';

interface ServiceDispatcherOptions {
  servicePrefix: string;
}

export class ServiceDispatcher extends EventEmitter {
  private options: ServiceDispatcherOptions;

  constructor(ws, options: ServiceDispatcherOptions) {
    super();

    this.options = options;

    ws.onopen    = this.emit.bind(this, 'connect');
    ws.onmessage = this.onPushMessage.bind(this);
    ws.onerror   = this.emit.bind(this, 'error');
    ws.onclose   = this.onClose.bind(this);
  }

  onPushMessage(evt) {
    var message, channel, data;

    try {
      message = JSON.parse(evt.data);
    } catch(e) {}

    if (!message || !message.event) {
      return false;
    }

    if (message.event.indexOf(this.options.servicePrefix) === 0) {
      this.emit('service_message', message);
    } else {
      this.emit('message', message);
    }
  }

  onClose(evt) {
    if (evt.code && evt.reason) {
      this.emit('close', evt);
    } else {
      this.emit('crash', evt);
    }
  }
}
