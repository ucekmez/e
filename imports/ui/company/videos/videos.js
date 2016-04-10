// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Positions collections

import './add_new_question.html'; // CompanyAddNewQuestion
import './list_questions.html'; // CompanyListQuestions
import './edit_question.html'; // CompanyEditQuestion



Template.CompanyAddNewQuestion.onRendered(function() {
  $('#responsetime').dropdown();
});


Template.CompanyListQuestions.helpers({
  questions() {
    return InterviewQuestions.find({ user: Meteor.userId() }, { sort: { createdAt : -1 }})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});


Template.CompanyListQuestions.events({
  'click #remove-question'(event, instance) {
    Meteor.call('remove_question', this._id);
  }
});

Template.CompanyEditQuestion.helpers({
  question() {
    return InterviewQuestions.findOne({_id: FlowRouter.getParam('questionId')});
  },
});

Template.CompanyEditQuestion.onRendered(function() {
  const question = InterviewQuestions.findOne({_id: FlowRouter.getParam('questionId')});
  $('#responsetime-edit').dropdown('set selected', question.time);
});

Template.CompanyEditQuestion.events({
  'click #submit-button'(event, instance) {
    $('.ui.form')
      .form({
        fields: {
          question_edit      : 'empty',
          responsetime_edit  : 'empty',
        }
      });

    if ($('.ui.form').form('is valid')) {
      const question = $('#question-edit').val();
      const description = $('#description-edit').val();
      const responsetime = $('#responsetime-edit').val();
      Meteor.call('edit_interview_question', FlowRouter.getParam('questionId'), question, description, responsetime, function (err, data) {
        if (err) {
          toastr.error(err.reason);
        }else {
          toastr.success('Question has been updated!');
          FlowRouter.go('list_questions');
        }
      });
    }else {
      toastr.error('Please correct the errors!');
    }
  }
});
