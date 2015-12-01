import {EventEmitter} from 'events';
import {config} from './config';
import {WS} from './websocket';
import {Channel} from './channel';

export class Gymmer extends EventEmitter {
  constructor(appKey, options = {}) {
    super();

    this.options  = Object.assign({}, config, options);
    this.channels = {};
    this.messages = [];
    this.createWsConnection(appKey);
  }

  createWsConnection(appKey) {
    var self = this;
    var ws   = new WS(`ws://${this.options.host}/v1/ws/app/${appKey}`);

    ws.onopen    = this.establishWsHandler.bind(this);
    ws.onmessage = this.pushHandler.bind(this);
    ws.onerror   = this.errorWsHandler;
    ws.onclose   = this.closeWsHandler;

    this._ws = ws;
  }

  subscribe(channel_name) {
    var channel = new Channel(channel_name, this);

    if (this.isConnected()) {
      channel.subscribe();
    }

    this.channels[channel_name] = channel;

    return channel;
  }

  unsubscribe(channel_name) {
    var channel = new Channel(channel_name, this);

    if (this.isConnected()) {
      channel.unsubscribe();
    }

    delete this.channels[channel_name];

    return channel;
  }

  send(message) {
    if (!message || typeof message != 'object') {
      return false;
    }

    if (this.isConnected()) {
      this._ws.send(JSON.stringify(message));
    } else {
      this.messages.push(message);
    }
  }

  establishWsHandler(evt) {
    let channels = Object.keys(this.channels).map(k => this.channels[k]);

    channels.forEach(channel => {
      channel.subscribe();
    });
  }

  pushHandler(evt) {
    var message, channel, data;

    try {
      message = JSON.parse(evt.data);
    } catch(e) {
    }

    channel = this.channels[message.channel];

    if (!message || !message.event || !channel) {
      return false;
    }

    channel.emit(message.event, message.data);
  }

  errorHandle(evt) {
    console.log("Ошибка " + error.message);
  }

  closeWsHandler(evt) {
    if (evt.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения');
    }
    console.log('Код: ' + evt.code + ' причина: ' + evt.reason);
  }

  getAppKey() {
    return APP_KEY;
  }

  isConnected() {
    return this._ws.readyState === 1;
  }
}
