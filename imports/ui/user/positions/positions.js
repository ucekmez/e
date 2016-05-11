import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Positions, RecruitmentProcesses, SingleProcesses, Applications } from '/imports/api/collections/positions.js'; // Positions collections
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections
import { PIs } from '/imports/api/collections/pis.js'; // Forms collections
import { Keynotes } from '/imports/api/collections/keynotes.js'; // Forms collections
import { InterviewQuestions } from '/imports/api/collections/videos.js'; // Forms collections


import './recruitment_process.html'; // UserPositionResponseApplyLayout
import './application_prerequisites.html'; // UserApplicationPrerequisitesLayout
import './application_survey.html'; // UserApplicationSurveyLayout
import './application_test.html'; // UserApplicationTestLayout
import './application_pi.html'; // UserApplicationPILayout
import './application_keynote.html'; // UserApplicationKeynoteLayout
import './application_video.html'; // UserApplicationVideoLayout

import '../keynotes/keynotes.js';


Template.UserPositionResponseApplyLayout.helpers({
  position() {
    return Positions.findOne(FlowRouter.getParam('positionId'));
  }
});


Template.UserPositionResponseApplyLayout.events({
  'click #user_position_apply_button'(event, instance) {
    Meteor.call("add_position_to_user_profile", FlowRouter.getParam('positionId'), function(err1, data1) {
      if (!err1) {
        toastr.info("Application process has been started!");

        const application = Applications.findOne({ position: FlowRouter.getParam('positionId')}); // applicationu aldik
        if (application) {
          const recruitment_process = RecruitmentProcesses.findOne({ position: application.position }); // ilgili ise alim surecini aldik
          if (recruitment_process) {
            Meteor.call("find_next_step", "apply", recruitment_process._id, function(err2, data2) {
              if (!err2) {
                if (data2 === "prerequisites") {
                  const prerequisites_process = SingleProcesses.findOne(recruitment_process.prerequisites);
                  Tracker.autorun(function(){
                    if (prerequisites_process) {
                      const form = Forms.findOne(prerequisites_process.related_to[0]);
                      if (form) {
                        console.log("simdi prereq formuna gidiyorum");
                        FlowRouter.go('user_position_applicationS1', {applicationId: application._id, formId: form._id});
                      }
                    }
                  });
                }else if(data2 === "survey"){
                  const survey_process = SingleProcesses.findOne(recruitment_process.survey);
                  Tracker.autorun(function(){
                    if (survey_process) {
                      const form = Forms.findOne(survey_process.related_to[0]);
                      if (form) {
                        console.log("simdi survey formuna gidiyorum");
                        FlowRouter.go('user_position_applicationS2', {applicationId: application._id, formId: form._id});
                      }
                    }
                  });
                }else if(data2 === "test"){
                  const test_process = SingleProcesses.findOne(recruitment_process.test);
                  Tracker.autorun(function(){
                    if (test_process) {
                      const form = Forms.findOne(test_process.related_to[0]);
                      if (form) {
                        console.log("simdi test formuna gidiyorum");
                        FlowRouter.go('user_position_applicationS3', {applicationId: application._id, formId: form._id});
                      }
                    }
                  });
                }else if(data2 === "pi"){
                  const pi_process = SingleProcesses.findOne(recruitment_process.pi);
                  Tracker.autorun(function(){
                    if (pi_process) {
                      const pi = PIs.findOne(pi_process.related_to[0]);
                      if (pi) {
                        console.log("simdi pi formuna gidiyorum");
                        FlowRouter.go('user_position_applicationS4', {applicationId: application._id, piId: pi._id});
                      }
                    }
                  });
                }else if(data2 === "keynote"){
                  const keynote_process = SingleProcesses.findOne(recruitment_process.keynote);
                  Tracker.autorun(function(){
                    if (keynote_process) {
                      const keynote = Keynotes.findOne(keynote_process.related_to[0]);
                      if (keynote) {
                        console.log("simdi keynotea gidiyorum");
                        FlowRouter.go('user_position_applicationS5', {applicationId: application._id, keynoteId: keynote._id});
                      }
                    }
                  });
                }else if(data2 === "video"){
                  const question_process = SingleProcesses.findOne(recruitment_process.video);
                  Tracker.autorun(function(){
                    if (question_process) {
                      const question = InterviewQuestions.findOne(question_process.related_to[0]);
                      if (question) {
                        console.log("simdi video soruya gidiyorum");
                        FlowRouter.go('user_position_applicationS6', {applicationId: application._id, questionId: question._id});
                      }
                    }
                  });
                }
              }else {
                toastr.warning(err2);
              }
            });
          }
        }
      }else {
        toastr.warning(err1);
      }
    });
  }
});


/////////////////////////////////////////////////////////////// prerequisites side

Template.UserApplicationPrerequisitesLayout.helpers({
  form() {
    return Forms.findOne(FlowRouter.getParam('formId'));
  }
});

Template.UserApplicationPrerequisitesLayout.events({
  'click #application-prerequisites-submit-button'(event, instance) {

    const result_form = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    const fields = JSON.parse(result_form.payload).fields;
    const response = new Array();

    const field_validations = {};
    fields.forEach(function(field) {
      if (field.required) {
        if (field.field_type === 'checkboxes' || field.field_type === 'radio') {
          field_validations[field.cid] = 'checked'
        }else {
          field_validations[field.cid] = 'empty'
        }

      }
    });
    //console.log(field_names);

    $('.ui.form')
      .form({
        fields: field_validations
    });

    if ($('.ui.form').form('is valid')) {
      fields.forEach(function(field) {
        if (field.field_type === 'paragraph') {
          const text = $(`.paragraph input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: text, type: field.field_type});

        } else if (field.field_type === 'checkboxes') {
          const checks = $(`.formcheckboxes input[name=${field.cid}]:checked`).map(function() {
            return this.value;
          }).get();
          response.push({label: field.label, cid: field.cid, val: checks, type: field.field_type});

        } else if (field.field_type === 'range') {
          const range = $(`.range input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: range, type: field.field_type});

        } else if (field.field_type === 'address') {
          const address = $(`.address input[name=${field.cid}_address]`).val();
          const city    = $(`.city input[name=${field.cid}_city]`).val();
          const country = $(`.country input[name=${field.cid}_country]`).val();
          response.push({label: field.label, cid: field.cid, val: {address: address, city: city, country: country}, type: field.field_type});

        } else if (field.field_type === 'radio') {
          const selected = $(`.formradio input[name=${field.cid}]:checked`).val();
          response.push({label: field.label, cid: field.cid, val: selected || "", type: field.field_type});

        } else if (field.field_type === 'dropdown') {
          const drop_select = $(`.formdropdown select[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: drop_select, type: field.field_type});

        } else if (field.field_type === 'number') {
          const number = $(`.number input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: number, type: field.field_type});
        }
      });

      //console.log(response);

      Meteor.call('add_new_response', response, FlowRouter.getParam('formId'), function(err1, response_id) {
        Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err2,data2) {
          toastr.success("Your response has been saved!");


          const application = Applications.findOne(FlowRouter.getParam('applicationId')); // applicationu aldik
          if (application) {
            const recruitment_process = RecruitmentProcesses.findOne({ position: application.position }); // ilgili ise alim surecini aldik
            if (recruitment_process) {
              Meteor.call("find_next_step", "S1", recruitment_process._id, function(err3, data3) {
                if (!err3) {
                  if(data3 === "survey"){
                    const survey_process = SingleProcesses.findOne(recruitment_process.survey);
                    Tracker.autorun(function(){
                      if (survey_process) {
                        const form = Forms.findOne(survey_process.related_to[0]);
                        if (form) {
                          console.log("simdi survey formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS2', {applicationId: application._id, formId: form._id});
                        }
                      }
                    });
                  }else if(data3 === "test"){
                    const test_process = SingleProcesses.findOne(recruitment_process.test);
                    Tracker.autorun(function(){
                      if (test_process) {
                        const form = Forms.findOne(test_process.related_to[0]);
                        if (form) {
                          console.log("simdi test formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS3', {applicationId: application._id, formId: form._id});
                        }
                      }
                    });
                  }else if(data3 === "pi"){
                    const pi_process = SingleProcesses.findOne(recruitment_process.pi);
                    Tracker.autorun(function(){
                      if (pi_process) {
                        const pi = PIs.findOne(pi_process.related_to[0]);
                        if (pi) {
                          console.log("simdi pi formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS4', {applicationId: application._id, piId: pi._id});
                        }
                      }
                    });
                  }else if(data3 === "keynote"){
                    const keynote_process = SingleProcesses.findOne(recruitment_process.keynote);
                    Tracker.autorun(function(){
                      if (keynote_process) {
                        const keynote = Keynotes.findOne(keynote_process.related_to[0]);
                        if (keynote) {
                          console.log("simdi keynotea gidiyorum");
                          FlowRouter.go('user_position_applicationS5', {applicationId: application._id, keynoteId: keynote._id});
                        }
                      }
                    });
                  }else if(data3 === "video"){
                    const question_process = SingleProcesses.findOne(recruitment_process.video);
                    Tracker.autorun(function(){
                      if (question_process) {
                        const question = InterviewQuestions.findOne(question_process.related_to[0]);
                        if (question) {
                          console.log("simdi video soruya gidiyorum");
                          FlowRouter.go('user_position_applicationS6', {applicationId: application._id, questionId: question._id});
                        }
                      }
                    });
                  }
                }else {
                  toastr.warning(err3);
                }
              });
            }
          }
        });
      });
    }else {
      toastr.warning("Please answer the required questions!");
    }

  }
});



//////////////////////////////////// survey step

Template.UserApplicationSurveyLayout.helpers({
  form() {
    return Forms.findOne(FlowRouter.getParam('formId'));
  }
});

Template.UserApplicationSurveyLayout.events({
  'click #application-survey-submit-button'(event, instance) {

    const result_form = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    const fields = JSON.parse(result_form.payload).fields;
    const response = new Array();

    const field_validations = {};
    fields.forEach(function(field) {
      if (field.required) {
        if (field.field_type === 'checkboxes' || field.field_type === 'radio') {
          field_validations[field.cid] = 'checked'
        }else {
          field_validations[field.cid] = 'empty'
        }

      }
    });
    //console.log(field_names);

    $('.ui.form')
      .form({
        fields: field_validations
    });

    if ($('.ui.form').form('is valid')) {
      fields.forEach(function(field) {
        if (field.field_type === 'paragraph') {
          const text = $(`.paragraph input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: text, type: field.field_type});

        } else if (field.field_type === 'checkboxes') {
          const checks = $(`.formcheckboxes input[name=${field.cid}]:checked`).map(function() {
            return this.value;
          }).get();
          response.push({label: field.label, cid: field.cid, val: checks, type: field.field_type});

        } else if (field.field_type === 'range') {
          const range = $(`.range input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: range, type: field.field_type});

        } else if (field.field_type === 'address') {
          const address = $(`.address input[name=${field.cid}_address]`).val();
          const city    = $(`.city input[name=${field.cid}_city]`).val();
          const country = $(`.country input[name=${field.cid}_country]`).val();
          response.push({label: field.label, cid: field.cid, val: {address: address, city: city, country: country}, type: field.field_type});

        } else if (field.field_type === 'radio') {
          const selected = $(`.formradio input[name=${field.cid}]:checked`).val();
          response.push({label: field.label, cid: field.cid, val: selected || "", type: field.field_type});

        } else if (field.field_type === 'dropdown') {
          const drop_select = $(`.formdropdown select[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: drop_select, type: field.field_type});

        } else if (field.field_type === 'number') {
          const number = $(`.number input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: number, type: field.field_type});
        }
      });

      //console.log(response);

      Meteor.call('add_new_response', response, FlowRouter.getParam('formId'), function(err1, response_id) {
        Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err2,data2) {
          toastr.success("Your response has been saved!");


          const application = Applications.findOne(FlowRouter.getParam('applicationId')); // applicationu aldik
          if (application) {
            const recruitment_process = RecruitmentProcesses.findOne({ position: application.position }); // ilgili ise alim surecini aldik
            if (recruitment_process) {
              Meteor.call("find_next_step", "S2", recruitment_process._id, function(err3, data3) {
                if (!err3) {
                  if(data3 === "test"){
                    const test_process = SingleProcesses.findOne(recruitment_process.test);
                    Tracker.autorun(function(){
                      if (test_process) {
                        const form = Forms.findOne(test_process.related_to[0]);
                        if (form) {
                          console.log("simdi test formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS3', {applicationId: application._id, formId: form._id});
                        }
                      }
                    });
                  }else if(data3 === "pi"){
                    const pi_process = SingleProcesses.findOne(recruitment_process.pi);
                    Tracker.autorun(function(){
                      if (pi_process) {
                        const pi = PIs.findOne(pi_process.related_to[0]);
                        if (pi) {
                          console.log("simdi pi formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS4', {applicationId: application._id, piId: pi._id});
                        }
                      }
                    });
                  }else if(data3 === "keynote"){
                    const keynote_process = SingleProcesses.findOne(recruitment_process.keynote);
                    Tracker.autorun(function(){
                      if (keynote_process) {
                        const keynote = Keynotes.findOne(keynote_process.related_to[0]);
                        if (keynote) {
                          console.log("simdi keynotea gidiyorum");
                          FlowRouter.go('user_position_applicationS5', {applicationId: application._id, keynoteId: keynote._id});
                        }
                      }
                    });
                  }else if(data3 === "video"){
                    const question_process = SingleProcesses.findOne(recruitment_process.video);
                    Tracker.autorun(function(){
                      if (question_process) {
                        const question = InterviewQuestions.findOne(question_process.related_to[0]);
                        if (question) {
                          console.log("simdi video soruya gidiyorum");
                          FlowRouter.go('user_position_applicationS6', {applicationId: application._id, questionId: question._id});
                        }
                      }
                    });
                  }
                }else {
                  toastr.warning(err3);
                }
              });
            }
          }
        });
      });
    }else {
      toastr.warning("Please answer the required questions!");
    }

  }
});


//////////////////////////////////// test step

Template.UserApplicationTestLayout.helpers({
  form() {
    return Forms.findOne(FlowRouter.getParam('formId'));
  }
});

Template.UserApplicationTestLayout.events({
  'click #application-test-submit-button'(event, instance) {

    const result_form = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    const fields = JSON.parse(result_form.payload).fields;
    const response = new Array();

    const field_validations = {};
    fields.forEach(function(field) {
      if (field.required) {
        if (field.field_type === 'checkboxes' || field.field_type === 'radio') {
          field_validations[field.cid] = 'checked'
        }else {
          field_validations[field.cid] = 'empty'
        }

      }
    });
    //console.log(field_names);

    $('.ui.form')
      .form({
        fields: field_validations
    });

    if ($('.ui.form').form('is valid')) {
      fields.forEach(function(field) {
        if (field.field_type === 'paragraph') {
          const text = $(`.paragraph input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: text, type: field.field_type});

        } else if (field.field_type === 'checkboxes') {
          const checks = $(`.formcheckboxes input[name=${field.cid}]:checked`).map(function() {
            return this.value;
          }).get();
          response.push({label: field.label, cid: field.cid, val: checks, type: field.field_type});

        } else if (field.field_type === 'range') {
          const range = $(`.range input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: range, type: field.field_type});

        } else if (field.field_type === 'address') {
          const address = $(`.address input[name=${field.cid}_address]`).val();
          const city    = $(`.city input[name=${field.cid}_city]`).val();
          const country = $(`.country input[name=${field.cid}_country]`).val();
          response.push({label: field.label, cid: field.cid, val: {address: address, city: city, country: country}, type: field.field_type});

        } else if (field.field_type === 'radio') {
          const selected = $(`.formradio input[name=${field.cid}]:checked`).val();
          response.push({label: field.label, cid: field.cid, val: selected || "", type: field.field_type});

        } else if (field.field_type === 'dropdown') {
          const drop_select = $(`.formdropdown select[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: drop_select, type: field.field_type});

        } else if (field.field_type === 'number') {
          const number = $(`.number input[name=${field.cid}]`).val();
          response.push({label: field.label, cid: field.cid, val: number, type: field.field_type});
        }
      });

      //console.log(response);

      Meteor.call('add_new_response', response, FlowRouter.getParam('formId'), function(err1, response_id) {
        Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err2,data2) {
          toastr.success("Your response has been saved!");

          const application = Applications.findOne(FlowRouter.getParam('applicationId')); // applicationu aldik
          if (application) {
            const recruitment_process = RecruitmentProcesses.findOne({ position: application.position }); // ilgili ise alim surecini aldik
            if (recruitment_process) {
              Meteor.call("find_next_step", "S3", recruitment_process._id, function(err3, data3) {
                if (!err3) {
                  if(data3 === "pi"){
                    const pi_process = SingleProcesses.findOne(recruitment_process.pi);
                    Tracker.autorun(function(){
                      if (pi_process) {
                        const pi = PIs.findOne(pi_process.related_to[0]);
                        if (pi) {
                          console.log("simdi pi formuna gidiyorum");
                          FlowRouter.go('user_position_applicationS4', {applicationId: application._id, piId: pi._id});
                        }
                      }
                    });
                  }else if(data3 === "keynote"){
                    const keynote_process = SingleProcesses.findOne(recruitment_process.keynote);
                    Tracker.autorun(function(){
                      if (keynote_process) {
                        const keynote = Keynotes.findOne(keynote_process.related_to[0]);
                        if (keynote) {
                          console.log("simdi keynotea gidiyorum");
                          FlowRouter.go('user_position_applicationS5', {applicationId: application._id, keynoteId: keynote._id});
                        }
                      }
                    });
                  }else if(data3 === "video"){
                    const question_process = SingleProcesses.findOne(recruitment_process.video);
                    Tracker.autorun(function(){
                      if (question_process) {
                        const question = InterviewQuestions.findOne(question_process.related_to[0]);
                        if (question) {
                          console.log("simdi video soruya gidiyorum");
                          FlowRouter.go('user_position_applicationS6', {applicationId: application._id, questionId: question._id});
                        }
                      }
                    });
                  }
                }else {
                  toastr.warning(err3);
                }
              });
            }
          }
        });
      });
    }else {
      toastr.warning("Please answer the required questions!");
    }

  }
});
