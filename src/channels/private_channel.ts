import {Channel} from 'channels/channel';
import {xhr} from 'services/xhr';

export class PrivateChannel extends Channel {
  /** Authorize user on backend before subscribe
   *
   * @param  {String}
   * @return {Object}
   */
  authorize(socketId) {
    if (!socketId) {
      return;
    }

    let options = this.gymmer.options.auth;
    return xhr.request({
      url: options.url,
      method: options.method,
      async: true,
      headers: options.headers,
      data: {socket_id: socketId}
    });

  }

  subscribe() {
    this.authorize(this.gymmer.socket_id)
      .then(xhr => {
        console.log(xhr);
        super.subscribe();
      })
      .catch(err => {
        console.log(`Errror: ${err.status}`);
      });
  }
}
