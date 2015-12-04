import EventEmitter from 'events';
import EVENTS from './events.js';

export class Channel extends EventEmitter {
  constructor(name, gymmer) {
    super();

    this.name  = name;
    this.gymmer = gymmer;
  }

  subscribe() {
    this.gymmer.send({event: EVENTS.CHANNEL_SUBSCRIBE, channel: this.name});
  }

  unsubscribe() {
    this.gymmer.send({event: EVENTS.CHANNEL_UNSUBSCRIBE, channel: this.name});
  }

  unbindAll() {
    this._events = {};
  }
}
