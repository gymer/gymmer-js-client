import Webws from './websocket';
import _ from 'lodash';
import config from './config';

let APP_KEY;

export class Gymmer {
  constructor(appKey, options = {}) {
    APP_KEY = appKey;

    this.options  = _.merge({}, config, options)
    this.messages = [];
    this.createWsConnection();
  }

  createWsConnection() {
    var self = this;
    var ws   = new WebSocket(this.options.wsUrl);

    ws.onopen = () => {
      console.log("Соединение установлено.");

      _.each(self.messages, m => {
        ws.send(m);
      });
      self.messages = [];
    };

    ws.onclose = (event) => {
      if (event.wasClean) {
        console.log('Соединение закрыто чисто');
      } else {
        console.log('Обрыв соединения');
      }
      console.log('Код: ' + event.code + ' причина: ' + event.reason);
    };

    ws.onmessage = (event) => {
      console.log("Получены данные " + event.data);
    };

    ws.onerror = (error) => {
      console.log("Ошибка " + error.message);
    };

    this._ws = ws;
  }

  send(message) {
    if (!message) {
      return false;
    }

    if (this._ws.readyState == 1) {
      this._ws.send(message);
    } else {
      this.messages.push(message);
    }
  }

  getAppKey() {
    return APP_KEY;
  }
}
