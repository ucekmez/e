import { Meteor } from 'meteor/meteor';
import '/imports/startup/server';
import { Slides, Keynotes } from '/imports/api/collections/keynotes.js';
import { InterviewQuestions, PreviewVideos } from '/imports/api/collections/videos.js';
import { Forms } from '/imports/api/collections/forms.js';

Sortable.collections = ['slides'];


// keynotes preview sayfasi yuklenirken beklesin diye
Meteor.publish("getSlidesOfKeynote", function(keynote_id) {
  return Slides.find({ keynote: keynote_id});
});

// video kayit/preview sayfasini refresh edince gelsin diye
Meteor.publish("getInterviewQuestion", function(question_id) {
  return InterviewQuestions.find({ _id: question_id });
});
Meteor.publish("getInterviewQuestionVideo", function(question_id, user_id) {
  return PreviewVideos.find({ $and : [{ question: question_id}, {user: user_id }]});
});


// form edit sayfasini refresh edince gelsin diye
Meteor.publish("getFormForPreview", function(form_id) {
  return Forms.find({ _id: form_id} );
});



AccountsTemplates.configure({
  postSignUpHook: function(userId, info) {
    Roles.addUsersToRoles(userId, ['user']);
  },
});

Meteor.startup(() => {
  // code to run on server at startup
});
