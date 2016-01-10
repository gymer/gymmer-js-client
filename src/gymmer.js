import {EventEmitter} from 'events';
import CONFIG from './config';
import {WS} from './websocket';
import {Channel} from './channel';
import {PrivateChannel} from './private_channel';
import {ServiceDispatcher} from './service_dispatcher';

export class Gymmer extends EventEmitter {
  constructor(appKey, options = {}) {
    super();

    this.options  = Object.assign({}, CONFIG, options);
    this.channels = {};
    this.messages = [];
    this.createWsConnection(appKey);
    this.service_dispatcher = new ServiceDispatcher(this);
  }

  createWsConnection(appKey) {
    var self = this;
    var ws   = new WS(`ws://${this.options.host}/v1/ws/app/${appKey}`);

    // ws.onopen    = this.establishWsHandler.bind(this);
    ws.onmessage = this.pushHandler.bind(this);
    ws.onerror   = this.errorWsHandler;
    ws.onclose   = this.closeWsHandler;

    this._ws = ws;
  }

  subscribe(channel_name) {
    let channel;

    if (channel_name[0] === "@") {
      channel = new PrivateChannel(channel_name, this);
    } else {
      channel = new Channel(channel_name, this);
    }

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

  establishWsHandler(socket_id) {
    if (!socket_id) {
      return;
    }

    this.socket_id = socket_id;
    let channels = Object.keys(this.channels).map(k => this.channels[k]);

    channels.forEach(channel => {
      channel.subscribe();
    });
  }

  pushHandler(evt) {
    var message, channel, data;

    try {
      message = JSON.parse(evt.data);
    } catch(e) {}

    if (!message || !message.event) {
      return false;
    }

    if (message.event.indexOf(CONFIG.SERVICE_MESSAGES_PREFIX) === 0) {
      this.service_dispatcher.handleEvent(message);
    }

    channel = this.channels[message.channel];
    if (channel) {
      channel.emit(message.event, message.data);
    }
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
