Meteor.publish('Comments', () => {
    return Comments.find({});
});
