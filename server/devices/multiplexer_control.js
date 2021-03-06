
Meteor.publish('MultiplexerControl', function () {
  return MultiplexerControl.find({}, {
    sort: { date: -1 },
    limit: 1
  });
});

Meteor.methods({

  'multiplexer:setChannel': function (options) {

    function setChannel (callback) {
      rasp2c.set(address, channel, value, mode, callback);
    }

    var channels = options.data.channels;
    var address = 0x70;
    var async = Meteor.npmRequire('async');

    var OFF = 'OFF';
    var channelByteMap = {
      'OFF': 0,
      '1': 4,
      '2': 5
    };
    var value = '';
    var mode = 'i';

    var checked = _.find(channels, function findState (channel) {
      return channel.checked;
    });
    var newChannel = checked ? checked.channel : OFF;

    var channel = channelByteMap[newChannel];

    async.series([setChannel, Meteor.bindEnvironment(function setData () {
      MultiplexerControl.upsert(options.id, options.data);
    })]);

  }
});
