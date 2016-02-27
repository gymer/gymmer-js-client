import {EventEmitter} from 'events';
import EVENTS from 'config/events';

export class Channel extends EventEmitter {
  constructor(name, gymer) {
    super();

    this.name  = name;
    this.gymer = gymer;
  }

  subscribe() {
    this.gymer.send({event: EVENTS.CHANNEL_SUBSCRIBE, channel: this.name});
  }

  unsubscribe() {
    this.gymer.send({event: EVENTS.CHANNEL_UNSUBSCRIBE, channel: this.name});
  }

  unbindAll() {
    this._events = {};
  }
}
