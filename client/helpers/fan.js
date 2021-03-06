
Meteor.subscribe('FanControl');

Template.fan.helpers({
  speed: function getSpeed () {

    var last = FanControl.findOne({}, { sort: { date: -1 }});
    var NONE_FOUND = 'N/A';

    return last ? last.speed : NONE_FOUND;
  },

  percent: function getPercent () {

    var last = FanControl.findOne({}, { sort: { date: -1 }});
    var NONE_FOUND = 'N/A';

    return last ? Math.round((last.speed / 63) * 100) : NONE_FOUND;
  }
});

Template.fan.events({
  'change input': function (e) {

    var speed = parseInt(e.target.value, 10);

    FanControl.setRPM(this._id, createData('speed', speed));
  }
});
