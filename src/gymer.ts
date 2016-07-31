import {EventEmitter} from 'events';
import CONFIG from 'config/config';
import EVENTS from 'config/events';
import {WS} from 'services/websocket';
import {Channel} from 'channels/channel';
import {PrivateChannel} from 'channels/private_channel';
import {ServiceDispatcher} from 'service_dispatcher';
import Utils from 'utils';

let APP_KEY, timeout_id;

const DEFAULT_OPTIONS = {
  wsUrl: "ws://localhost:8000/ws",
  auth: {
    url: "/pusher/auth",
    method: "POST"
  },
  debug: "console"
};

export class Gymer extends EventEmitter {
  constructor(appKey, options = {}) {
    super();

    APP_KEY = appKey;

    this.options = Utils.merge(DEFAULT_OPTIONS, options);
    this.channels = {};
    this.messages = [];
    this.createWsConnection(APP_KEY);
  }

  createWsConnection(appKey) {
    var ws   = new WS(`ws://${this.options.host}/v1/ws/app/${appKey}`);

    // ws.onopen    = this.establishWsHandler.bind(this);

    this._ws = ws;
    this.dispatcher = new ServiceDispatcher(ws, {servicePrefix: CONFIG.SERVICE_MESSAGES_PREFIX});
    this.dispatcher.on('message', this.onPush.bind(this));
    this.dispatcher.on('service_message', this.onServiceMessage.bind(this));
    this.dispatcher.on('close', this.onCloseSocket.bind(this));
    this.dispatcher.on('crash', this.onCrashSocket.bind(this));
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
      this.log("Event sent:", message);
    } else {
      this.messages.push(message);
    }
  }

  onSocketInit(socket_id) {
    if (!socket_id) {
      return;
    }

    this.socket_id = socket_id;
    let channels = Object.keys(this.channels).map(k => this.channels[k]);

    channels.forEach(channel => {
      channel.subscribe();
    });
  }

  onPush(message) {
    let channel = this.channels[message.channel];

    if (channel) {
      channel.emit(message.event, message.data);
    }


    this.log("Event recived:", message);
  }

  onCloseSocket(evt) {
    this.warn("WebSocket connection to", evt.target.url, "failed:", evt.reason);
  }

  onCrashSocket(evt) {
    this.warn("WebSocket connection to", evt.target.url, "failed. Trying to reconnect...");

    clearTimeout(timeout_id);
    timeout_id = setTimeout(() => {
      this.createWsConnection(APP_KEY);
    }, CONFIG.SOCKET_RESTORE_TIMEOUT);
  }

  onServiceMessage(message) {
    switch (message.event) {
      case EVENTS.CONNECTION_ESTABLISHED:
        this.onSocketInit(message.data.socket_id);
        break;
    }

    this.log("Service event received:", message);
  }

  isConnected() {
    return this._ws.readyState === 1;
  }

  log(...params: any[]) {
    let debug = this.options.debug;

    if (!debug) {
      return;
    }

    params.unshift(CONFIG.SERVICE_MESSAGES_PREFIX);

    if (debug === "console" && window.console && window.console.log) {
      window.console.log(Utils.stringify.apply(null, params));
    }
  }

  warn(...params: any[]) {
    let debug = this.options.debug;

    if (!debug) {
      return;
    }

    params.unshift(CONFIG.SERVICE_MESSAGES_PREFIX);

    if (debug === "console" && window.console && window.console.warn) {
      window.console.warn(Utils.stringify.apply(null, params));
    }
  }
}

module.exports = Gymer