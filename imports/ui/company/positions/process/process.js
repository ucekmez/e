// disariya export etmek istedigimiz her sey bu dosyada olacak
import { Positions, RecruitmentProcesses, SingleProcesses } from '/imports/api/collections/positions.js'; // Positions collections
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections
import { PIGroups } from '/imports/api/collections/pis.js'; // PIs collections
import { Keynotes } from '/imports/api/collections/keynotes.js'; // Keynotes collections
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Videos collections

import { Template } from 'meteor/templating';

import './edit_process_prerequisites.html';
import './edit_process_survey.html';
import './edit_process_test.html';
import './edit_process_pi.html';
import './edit_process_keynote.html';
import './edit_process_video.html';



////////////////// prerequisites //////////////////////

Template.CompanyExtendRecruitmentProcessS1.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  prerequisites() {
    return Forms.find({ user: Meteor.userId(), type: 'prerequisite' },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.prerequisites) {
      const single_process = SingleProcesses.findOne(rec_process.prerequisites);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS1.events({
  'click #next-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS2', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.prerequisites')
      .form({
        fields: {
          prerequisites      : 'empty',
        }
      });

    if ($('.ui.form.prerequisites').form('is valid')) {
      const prerequisites = $('#prerequisites').val();
      const description = $('#prerequisite_description').val();
      if (prerequisites) {

        Meteor.call('edit_recruitment_process_prerequisites', FlowRouter.getParam('positionId'), prerequisites, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('extend_recruitment_positionS2', {positionId: FlowRouter.getParam('positionId')});
          }
        });
      }else {
        toastr.error('Please choose a form!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS1.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.prerequisites) {
      const single_process = SingleProcesses.findOne(rec_process.prerequisites);
      if (single_process && single_process.related_to) {
        $('#prerequisites').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#prerequisites').dropdown();
    }
  });
});










////////////////// survey //////////////////////

Template.CompanyExtendRecruitmentProcessS2.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  surveys() {
    return Forms.find({ user: Meteor.userId(), type: 'form' },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.survey) {
      const single_process = SingleProcesses.findOne(rec_process.survey);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS2.events({
  'click #prev-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS1', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #next-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS3', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.survey')
      .form({
        fields: {
          survey      : 'empty',
        }
      });

    if ($('.ui.form.survey').form('is valid')) {
      const survey = $('#survey').val();
      const description = $('#survey_description').val();
      if (survey) {

        Meteor.call('edit_recruitment_process_survey', FlowRouter.getParam('positionId'), survey, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('extend_recruitment_positionS3', {positionId: FlowRouter.getParam('positionId')});
          }
        });
      }else {
        toastr.error('Please choose a form!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS2.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.survey) {
      const single_process = SingleProcesses.findOne(rec_process.survey);
      if (single_process && single_process.related_to) {
        $('#survey').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#survey').dropdown();
    }
  });
});







////////////////// test //////////////////////

Template.CompanyExtendRecruitmentProcessS3.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  tests() {
    return Forms.find({ user: Meteor.userId(), type: 'test' },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.test) {
      const single_process = SingleProcesses.findOne(rec_process.test);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS3.events({
  'click #prev-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS2', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #next-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS4', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.test')
      .form({
        fields: {
          test      : 'empty',
        }
      });

    if ($('.ui.form.test').form('is valid')) {
      const test = $('#test').val();
      const description = $('#test_description').val();
      if (test) {

        Meteor.call('edit_recruitment_process_test', FlowRouter.getParam('positionId'), test, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('extend_recruitment_positionS4', {positionId: FlowRouter.getParam('positionId')});
          }
        });
      }else {
        toastr.error('Please choose a form!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS3.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.test) {
      const single_process = SingleProcesses.findOne(rec_process.test);
      if (single_process && single_process.related_to) {
        $('#test').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#test').dropdown();
    }
  });
});




////////////////// personality inventory //////////////////////

Template.CompanyExtendRecruitmentProcessS4.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  pis() {
    return PIGroups.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.pi) {
      const single_process = SingleProcesses.findOne(rec_process.pi);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS4.events({
  'click #prev-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS3', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #next-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS5', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.pi')
      .form({
        fields: {
          pi      : 'empty',
        }
      });

    if ($('.ui.form.pi').form('is valid')) {
      const pi = $('#pi').val();
      const description = $('#pi_description').val();
      if (pi) {

        Meteor.call('edit_recruitment_process_pi', FlowRouter.getParam('positionId'), pi, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('extend_recruitment_positionS5', {positionId: FlowRouter.getParam('positionId')});
          }
        });
      }else {
        toastr.error('Please choose a PI!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS4.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.pi) {
      const single_process = SingleProcesses.findOne(rec_process.pi);
      if (single_process && single_process.related_to) {
        $('#pi').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#pi').dropdown();
    }
  });
});




////////////////// keynote //////////////////////

Template.CompanyExtendRecruitmentProcessS5.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  keynotes() {
    return Keynotes.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.keynote) {
      const single_process = SingleProcesses.findOne(rec_process.keynote);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS5.events({
  'click #prev-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS4', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #next-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS6', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.keynote')
      .form({
        fields: {
          keynote      : 'empty',
        }
      });

    if ($('.ui.form.keynote').form('is valid')) {
      const keynote = $('#keynote').val();
      const description = $('#keynote_description').val();
      if (keynote) {
        Meteor.call('edit_recruitment_process_keynote', FlowRouter.getParam('positionId'), keynote, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('extend_recruitment_positionS6', {positionId: FlowRouter.getParam('positionId')});
          }
        });
      }else {
        toastr.error('Please choose a Keynote!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS5.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.keynote) {
      const single_process = SingleProcesses.findOne(rec_process.keynote);
      if (single_process && single_process.related_to) {
        $('#keynote').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#keynote').dropdown();
    }
  });
});




////////////////// video //////////////////////

Template.CompanyExtendRecruitmentProcessS6.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  },
  videos() {
    return InterviewQuestions.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  description() {
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.video) {
      const single_process = SingleProcesses.findOne(rec_process.video);
      if (single_process) {
        return single_process.description;
      }
    }
  },
});

Template.CompanyExtendRecruitmentProcessS6.events({
  'click #prev-button'(event, instance) {
    FlowRouter.go('extend_recruitment_positionS5', {positionId: FlowRouter.getParam('positionId')});
  },
  'click #submit-button'(event, instance) {
    $('.ui.form.video')
      .form({
        fields: {
          video      : 'empty',
        }
      });

    if ($('.ui.form.video').form('is valid')) {
      const video = $('#video').val();
      const description = $('#video_description').val();
      if (video) {
        Meteor.call('edit_recruitment_process_video', FlowRouter.getParam('positionId'), video, description, function (err, data) {
          if (err) {
            toastr.error(err.reason);
          }else {
            toastr.success('Process has been updated!');
            FlowRouter.go('list_positions');
          }
        });
      }else {
        toastr.error('Please choose a Video Question!');
      }
    }else {
      toastr.error('Please correct the errors!');
    }
  },
});


Template.CompanyExtendRecruitmentProcessS6.onRendered(function() {
  Tracker.autorun(function(){
    const rec_process = RecruitmentProcesses.findOne({ position: FlowRouter.getParam('positionId')});
    if (rec_process && rec_process.video) {
      const single_process = SingleProcesses.findOne(rec_process.video);
      if (single_process && single_process.related_to) {
        $('#video').dropdown('set selected', single_process.related_to);
      }
    }else {
      $('#video').dropdown();
    }
  });
});
