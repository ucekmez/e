import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js';
import { InterviewQuestions } from '/imports/api/collections/videos.js';

Sortable.collections = ['slides'];

Meteor.publish("getSlidesOfKeynote", function(keynote_id) {
  return Slides.find({ keynote: keynote_id});
});

Meteor.publish("getInterviewQuestion", function(question_id) {
  return InterviewQuestions.find({ _id: question_id});
});



AccountsTemplates.configure({
  postSignUpHook: function(userId, info) {
    Roles.addUsersToRoles(userId, ['user']);
  },
});

Meteor.startup(() => {
  // code to run on server at startup
});
