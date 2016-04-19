import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { InterviewQuestions, Videos,VideoResponses } from '/imports/api/collections/videos.js'; // Videos collections

import  videojs  from 'video.js';
import  record  from 'videojs-record';

import './video_response.html'; // UserKeynoteResponseLayout


Template.UserVideoResponseLayout.onRendered(function() {
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

      if (question) {
        q_player = videojs("user-interview", {
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


Template.UserVideoResponseLayout.helpers({
  question() {
    return InterviewQuestions.findOne(FlowRouter.getParam('questionId'));
  },
});
