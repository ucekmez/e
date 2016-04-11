// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Positions collections

import  videojs  from 'video.js';
import  record  from 'videojs-record';
//import MRecordRTC from 'recordrtc';


import './add_new_question.html'; // CompanyAddNewQuestion
import './list_questions.html'; // CompanyListQuestions
import './edit_question.html'; // CompanyEditQuestion
import './preview_question.html'; // CompanyPreviewQuestion


Template.CompanyAddNewQuestion.onRendered(function() {
  $('#responsetime').dropdown();
});

/* // lukemuke video recorder plugin
Template.lmVideoCapture.events({
  'click .lm-video-capture-record-start-btn'(event, instance) {
    $('.lm-video-capture-video video')[0].muted = true;
    $('.lm-video-capture-video video')[0].controls = false;
  },
  'click .lm-video-capture-record-stop-btn'(event, instance) {
    $('.lm-video-capture-video video')[0].muted = false;
    $('.lm-video-capture-video video')[0].controls = true;
  },
});

*/

/* // lukemuke video recorder plugin
Template.CompanyPreviewQuestion.helpers({
  opts: function() {
    var opts ={
       maxTime: 10,
      // androidQuality: 0,
       videoDisplay: {
         width: 600,
         height: 400
       },
       classes: {
         recordBtn: 'video-capture-basic-record-btn',
         stopBtn: 'video-capture-basic-stop-btn'
       },
      onVideoRecorded: function(err, base64Data) {
        $('.lm-video-capture-video video')[0].muted = false;
        $('.lm-video-capture-video video')[0].controls = true;
      }
    };
    return opts;
  }
});

*/

Template.CompanyPreviewQuestion.helpers({
  question() {
    return InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
  }
});

Template.CompanyPreviewQuestion.onRendered(function() {
  FlowRouter.subsReady("showquestion", function() {
    const question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));

    if (question) {
      q_player = videojs("interview", {
        // video.js options
        controls: true,
        loop: false,
        width: 640,
        height: 480,
        plugins: {
            // videojs-record plugin options
            record: {
                image: false,
                audio: true,
                video: true,
                maxLength: question.time,
                debug: false
            }
        }
      });

      q_player.on('startRecord', function() {
        console.log('started recording!');
      });

      q_player.on('stopRecord', function() {
        console.log('stopped recording!');
      });

      q_player.on('deviceError', function() {
        if (q_player.deviceErrorCode === "PermissionDeniedError") {
          toastr.warning("You must give permission to your camera and mic!");
        }else if (q_player.deviceErrorCode === "NotFoundError") {
          toastr.warning("You need Firefox or Chrome to record!");
        }else {
          toastr.warning("An unknown error occured! Please reload the page.");
        }
      });
    }

  });
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
  },
  'click #preview-question'(event, instance) {
    Session.set("selected_question", this._id);
    $('.modal.preview-question')
      .modal({
        //blurring: true,
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
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