import {Channel} from 'channels/channel';

describe('Channel', () => {
  let channel, mock, gymmer;

  beforeEach(() => {
    gymmer = Object.create({send: () => {}});
    mock = {
      callback: () => {}
    };
    spyOn(mock, 'callback');
    spyOn(gymmer, 'send');

    channel = new Channel('test_channel', gymmer);
    channel.on('test_event', () => {
      mock.callback();
    });
  });

  it('get `name` and main `object` for initializing', () => {
    expect(channel.name).toBe('test_channel');
    expect(channel.gymmer).toBe(gymmer);
  });

  it('provide event emmiter.', () => {
    channel.emit('test_event');
    expect(mock.callback).toHaveBeenCalled();
  });

  describe('#subscribe().', () => {
    beforeEach(() => {
      channel.subscribe();
    });

    it('call `send()` main object method with `gymmer:subscribe` event param.', () => {
      expect(gymmer.send).toHaveBeenCalledWith({event: 'gymmer:subscribe', channel: 'test_channel'});
    });
  });

  describe('#unsubscribe().', () => {
    beforeEach(() => {
      channel.unsubscribe();
    });

    it('call `send()` main object method with `gymmer:subscribe` event param.', () => {
      expect(gymmer.send).toHaveBeenCalledWith({event: 'gymmer:unsubscribe', channel: 'test_channel'});
    });
  });

});
