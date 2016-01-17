import {Channel} from 'channels/channel';

describe('Channel', () => {
  let channel, callback;

  beforeEach(() => {
    callback = () => {};
    channel = new Channel('test_channel', {});
    channel.on('test_event', callback);
  });

  it('Provide event emmiter', () => {
    expect(channel._events.test_event).toBe(callback);

    spyOn(channel._events, 'test_event').and.callThrough();
    channel.emit('test_event');
    expect(channel._events.test_event).toHaveBeenCalled();
  });
});
