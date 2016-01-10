import EVENTS from './events.js';

export class ServiceDispatcher {
  constructor(gymmer) {
    this.gymmer = gymmer;
  }

  handleEvent(message) {
    switch (message.event) {
      case EVENTS.CONNECTION_ESTABLISHED:
        this.gymmer.establishWsHandler(message.data.socket_id);
        break;
      default:
        break;
    }
  }
}
