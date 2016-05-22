// disariya export etmek istedigimiz her sey bu dosyada olacak

import { Template } from 'meteor/templating';
import { InterviewQuestions, VideoResponses, Videos } from '/imports/api/collections/videos.js'; // Positions collections

import  videojs  from 'video.js';
import  record  from 'videojs-record';
//import MRecordRTC from 'recordrtc';

import  Clipboard  from 'clipboard'; // from clipboard.js (npm dependency)

import '../generic_events.js';

import './add_new_question.html'; // CompanyAddNewQuestion
import './list_questions.html'; // CompanyListQuestions
import './edit_question.html'; // CompanyEditQuestion
import './preview_question.html'; // CompanyPreviewQuestion
import './list_applicant_responses.html'; // CompanyPreviewQuestion

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

Template.CompanyPreviewRecordQuestion.helpers({
  question() {
    const interview_question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
    if (interview_question.user === Meteor.userId()) {
      return interview_question;
    }else {
      FlowRouter.go('notfound');
    }
  }
});

Template.CompanyPreviewRecordQuestion.onRendered(function() {
  FlowRouter.subsReady("showquestion", function() {
    FlowRouter.subsReady("showquestionvideo", function() {
      $('.info.icon.description').popup({
          hoverable: true,
          position : 'right center',
          delay: {
            show: 300,
            hide: 800
          }
        });

      const question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));

      if (question && question.user === Meteor.userId()) {
        q_player = videojs("interview", {
          // video.js options
          width: 640,
          height: 480,
          plugins: {
              // videojs-record plugin options
              record: {
                  image: false,
                  audio: true,
                  video: {
                    mandatory: {
                      minWidth: 320,
                      minHeight: 240
                    }
                  },
                  frameWidth: 320,
                  frameHeight: 240,
                  maxLength: question.time,
                  debug: false
              }
          }
        });

        q_player.on('devideReady', function() {
          //console.log('device is ready!');
        });

        q_player.on('startRecord', function() {
          //console.log('started recording!');
        });

        q_player.on('stopRecord', function() {
          //console.log('stopped recording!');
        });

        q_player.on('finishRecord', function() {
          //const video = new Blob([q_player.recordedData], { type: 'video/*'});
          // FF = q_player.recordedData;

          let data = q_player.recordedData; // if Firefox
          if (/WebKit/.test(navigator.userAgent)) {
            data = q_player.recordedData.video; // Chrome
          }
          Videos.insert(data, function(err, fileObj) {
            Meteor.call('save_video_response_preview', question._id, fileObj._id, function() {
              toastr.info("Your response has been saved!");
            });
          });
        })

        q_player.on('deviceError', function() {
          if (q_player.deviceErrorCode === "PermissionDeniedError") {
            toastr.warning("You must give permission to your camera and mic!");
          }else if (q_player.deviceErrorCode === "NotFoundError") {
            toastr.warning("You must have a working camera + mic!");
          }else {
            toastr.warning("You need Firefox or Chrome to record!");
          }
        });
      }
    });
  });
});


Template.CompanyPreviewAnswerQuestion.onRendered(function(){
  FlowRouter.subsReady("showquestion", function() {
    FlowRouter.subsReady("showquestionvideo", function() {
      $('.info.icon.description').popup({
          hoverable: true,
          position : 'right center',
          delay: {
            show: 300,
            hide: 800
          }
        });

      const preview_video = VideoResponses.findOne({ $and : [{ question: FlowRouter.getParam('questionId')}, {user: Meteor.userId() }]});

      if (preview_video) {
        a_player = videojs("preview-answer", {
          "width": 640,
          "height": 480,
          "poster": "/img/fililabs_logo.png",
        });
      }
    });
  });
});


Template.CompanyPreviewAnswerQuestion.helpers({
  question() {
    const interview_question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
    if (interview_question.user === Meteor.userId()) {
      return interview_question;
    }else {
      FlowRouter.go('notfound');
    }
  },
  video_url() {
    A = VideoResponses.findOne({ $and : [{ question: FlowRouter.getParam('questionId')}, {user: Meteor.userId() }]});
    if (A) {
      return Videos.findOne(A.video).url();
    }
  }
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
  'click #add_new_question_right'(event, instance) {
    f_add_new_question(event, instance);
  },
  'click #remove-question'(event, instance) {
    Meteor.call('remove_question', this._id);
  },
  'click #export-video-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-video-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-video-to-applicant input')
            .val(FlowRouter.url('user_videoresponse') + '/' + _this._id);
        },
        onHidden() {
          $('#copytext').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  }
});

Template.CompanyEditQuestion.helpers({
  question() {
    const interview_question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
    if (interview_question.user === Meteor.userId()) {
      return interview_question;
    }else {
      FlowRouter.go('notfound');
    }
  },
});

Template.CompanyEditQuestion.onRendered(function() {
  const question = InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
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




Template.CompanyListApplicantVideoResponses.helpers({
  question() {
    return InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
  },
  responses() {
    return VideoResponses.find({ question: FlowRouter.getParam('questionId') }, { sort : {createdAt: -1} })
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});


// single applicant response
Template.CompanyPreviewApplicantVideoResponse.onRendered(function(){
  FlowRouter.subsReady("showquestion", function() {
    FlowRouter.subsReady("showquestionvideo", function() {
      $('.info.icon.description').popup({
          hoverable: true,
          position : 'right center',
          delay: {
            show: 300,
            hide: 800
          }
        });

      const preview_video = VideoResponses.findOne(FlowRouter.getParam('responseId'));

      if (preview_video) {
        a_player = videojs("user-preview-answer", {
          "width": 640,
          "height": 480,
          "poster": "/img/fililabs_logo.png",
        });
      }
    });
  });
});


Template.CompanyPreviewApplicantVideoResponse.helpers({
  user_info() {
    const video_response = VideoResponses.findOne(FlowRouter.getParam('responseId'));
    if (video_response) {
      if (video_response.user_name) {
        return video_response.user_name;
      }else {
        return video_response.email;
      }
    }
  },
  question() {
    const video_response = VideoResponses.findOne(FlowRouter.getParam('responseId'));
    if (video_response) {
      return InterviewQuestions.findOne(video_response.question);
    }
  },
  video_url() {
    A = VideoResponses.findOne(FlowRouter.getParam('responseId'));
    if (A) {
      return Videos.findOne(A.video).url();
    }
  }
});



Template.registerHelper("coming_from_single_videos", function(){
  return Session.get("coming_from") === "single_videos";
});

Template.registerHelper("current_application_id", function(){
  return Session.get("current_application_id");
});
