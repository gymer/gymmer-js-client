require('jasmine-ajax');

import {Channel} from 'channels/channel';
import {PrivateChannel} from 'channels/private_channel';

let request;
let FAKE_BACKEND = {
  auth: {
    success: {
      status: 200,
      responseText: '{"auth": true}'
    },
    fail: {
      status: 401,
      responseText: 'Not autorized.'
    }
  }
};

describe('PrivateChannel', () => {
  let channel, mock, gymmer;

  beforeEach(() => {
    gymmer = {
      socket_id: '1234567',
      options: {
        auth: {url: "http://my-backend.com/pusher/auth", method: "POST", headers: {'X-CSRF-Token': "SOME_CSRF_TOKEN"}}
      },
      send: () => {}
    };

    spyOn(gymmer, 'send');
    channel = new PrivateChannel('test_channel', gymmer);
  });

  it('inherit from Channel.', () => {
    expect(channel instanceof Channel).toBeTruthy();
  });

  describe('#subscribe()', () => {
    beforeEach(() => {
      jasmine.Ajax.install();
      channel.subscribe();

      request = jasmine.Ajax.requests.mostRecent();
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
    });

    it('make authorization backend request before subscribe command.', () => {
      expect(request.url).toBe('http://my-backend.com/pusher/auth');
      expect(request.method).toBe('POST');
    });

    describe('Autorized.', () => {
      beforeEach((done) => {
        spyOn(Channel.prototype, 'subscribe');
        request.respondWith(FAKE_BACKEND.auth.success);
        setTimeout(done, 0);
      });

      it('can subscribe to private channel.', () => {
        expect(Channel.prototype.subscribe).toHaveBeenCalled();
      });
    });

    describe('Unautorized.', () => {
      beforeEach((done) => {
        spyOn(Channel.prototype, 'subscribe');
        request.respondWith(FAKE_BACKEND.auth.fail);
        setTimeout(done, 0);
      });

      it('cannot subscribe to private channel.', () => {
        expect(Channel.prototype.subscribe).not.toHaveBeenCalled();
      });
    });
  });
});
