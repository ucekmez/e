import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js';

Sortable.collections = ['slides'];

Meteor.publish("getSlidesOfKeynote", function(keynote_id) {
  return Slides.find({ keynote: keynote_id});
});


Meteor.startup(() => {
  // code to run on server at startup
});
