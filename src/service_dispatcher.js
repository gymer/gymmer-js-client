import EventEmitter from 'events';

export class ServiceDispatcher extends EventEmitter {
  constructor(ws, options = {}) {
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
    if (evt.wasClean) {
      this.emit('close', evt);
    } else {
      this.emit('crash', evt);
    }
  }
}
