
Meteor.subscribe('TemperatureSensor');
Meteor.subscribe('HeaterControl');

Template.temperature.helpers({
  current: function getTemperature () {

    var last = TemperatureSensor.findOne({}, { sort: { date: -1 }});
    var NONE_FOUND = 'N/A';

    return last ? last.current : NONE_FOUND;

  },

  target: function getTarget () {

    var last = HeaterControl.findOne({}, { sort: { date: -1 }});
    var NONE_FOUND = '(Not set)';

    return last ? last.target : NONE_FOUND;
  }
});

Template.temperature.events({

  'click button': function (e) {
    e.preventDefault();

    var $button = $(e.target);
    var $input = $button.siblings('.temperature-control');
    var newTemperature = $input.val();

    $input.val('');

    HeaterControl.setTemperature(
      this._id,
      createData('target', newTemperature)
    );
  }
});