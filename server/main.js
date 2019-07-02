import { Meteor } from 'meteor/meteor';

import '/pages/collections/Users';
import '/pages/publications/Users';
import '/pages/methods/Users';

import '/pages/collections/Messages';
import '/pages/publications/Messages';
import '/pages/methods/Messages';

import '/pages/collections/Articles';
import '/pages/publications/Articles';
import '/pages/methods/Articles';

import '/pages/collections/Comments';
import '/pages/publications/Comments';
import '/pages/methods/Comments';

Meteor.startup(() => {
  // code to run on server at startup
});
