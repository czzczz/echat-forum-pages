Meteor.publish('Articles', function () {
    return Articles.find({});
});