import { Template } from 'meteor/templating';
import { Forms, Responses, FormResponses, PredefinedLanguageTemplates, PredefinedTechnicalTemplates, PredefinedLanguageQuestions, PredefinedTechnicalQuestions, PredefinedLanguageTestResponses, PredefinedTechnicalTestResponses } from '/imports/api/collections/forms.js'; // Forms collections
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Sectors } from '/imports/api/collections/positions.js'; // Positions collections

import './edit_form.html'; // CompanyEditFormLayout CompanyEditForm
import './list_forms.html'; // CompanyListForms
import './preview_form.html'; // CompanyPreviewForm
import './preview_language_test.html'; // CompanyPreviewLanguageTest
import './language_test_response.html'; // CompanyLanguageTestResponse
import './preview_technical_test.html'; // CompanyPreviewTechnicalTest
import './technical_test_response.html'; // CompanyTechnicalTestResponse
import './list_applicant_responses.html'; // CompanyListApplicantFormResponses
import './list_lang_applicant_responses.html' // CompanyListLangApplicantFormResponses
import './list_tech_applicant_responses.html' // CompanyListTechApplicantFormResponses

import  Clipboard  from 'clipboard'; // from clipboard.js (npm dependency)

import '../generic_events.js';

//////////////////////// ******************** CompanyEditForm

Template.CompanyEditForm.helpers({
  form() {
    return Forms.findOne({_id: FlowRouter.getParam('formId')});
  }
});

Template.CompanyEditForm.events({
  'click .show-edit-name'(event, instance) {
    $('.show-edit-name').hide();
    $('.item.edit-name-form').show();
  },
  'click .button.save-new-name'(event, instance) {
    const new_name = $('#new-name-value').val();
    Meteor.call('edit_company_form_name', FlowRouter.getParam('formId'), new_name, function(err, data) {
      if (!err) {
        toastr.info("New name has been saved!");
        $('.show-edit-name').show();
        $('.item.edit-name-form').hide();
      }else {
        toastr.warning(err);
      }

    });

  }
});

Template.CompanyEditForm.onRendered(function() {
  FlowRouter.subsReady("getformpreview", function() {
    const form = Forms.findOne({_id: FlowRouter.getParam('formId')});

    if (form && form.user === Meteor.userId()) {
      fb = new Formbuilder({ selector: '.fb-main', bootstrapData: form.payload ? JSON.parse(form.payload).fields : [], workingFormType: form.type });
      fb.on('save', function(payload) {
        Meteor.call("update_form_payload", form._id, payload, function(err, data) {
          toastr.info("Form updated!");
        });
      });
      if (form.type == 'test' || form.type == 'prerequisite') {
          $("a[data-field-type='address']").remove();
          $("a[data-field-type='number']").remove();
          $("a[data-field-type='date']").remove();
          $("a[data-field-type='paragraph']").remove();
          $("a[data-field-type='range']").remove();
          $("a[data-field-type='dropdown']").remove();
          $("a[data-field-type='section_break']").remove();
      }
      $('.ui.sticky').sticky({ context: '.fb-main' });
    }
  });
});


//////////////////////// ******************** CompanyListForms

Template.CompanyAddTechnicalTest.helpers({
  sectors() {
    return Sectors.find();
  },
});

Template.CompanyListForms.helpers({
  predefinedlanguagetemplates() {
    return PredefinedLanguageTemplates.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  predefinedtechnicaltemplates() {
    return PredefinedTechnicalTemplates.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
  forms() {
    return Forms.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyListForms.events({
  'click #preview-lang-test-response-action'(event, instance) {
    const response = PredefinedLanguageTestResponses.findOne({ template: this._id });
    if (response) {
      FlowRouter.go('preview_lang_test_response', { responseId: response._id });
    }else {
      toastr.warning("There is no response for this test");
    }
  },
  'click #remove-language-test'(event, instance) {
    Meteor.call('remove_language_test', this._id);
  },

  //// lang test
  'click .button.add-lang-test'(event, instance) {
    $('.modal.add-new-language-test')
      .modal({
        //blurring: true,
        onShow() {},
        onHidden() {},
        onDeny() {
          $('.ui.form.language').form('reset');
          $('.ui.form.language').form('clear');
          Session.set("add-lang-test-success", false);
        },
        onApprove() {
          $('.ui.form.language')
            .form({
              fields: {
                langtestname        : 'empty',
                selecttestlanguage  : 'empty',
                selectlangtestlevel : 'empty',
                langnumberofquestions   : 'empty',
              }
            });

          if ($('.ui.form.language').form('is valid')) {
            const testname = $('#langtestname').val();
            const testlanguage = $('#selecttestlanguage').val();
            const level = $('#selectlangtestlevel').val();
            const numberofquestions = $('#langnumberofquestions').val();

            if (numberofquestions <= 20) {
              Meteor.call('create_new_language_test_template', testname, testlanguage, numberofquestions, level, function (err, data) {
                if (err) {
                  toastr.error(err.reason);
                  Session.set("add-lang-test-success", false);
                }else {
                  Session.set("add-lang-test-success", false);
                  $(".ui.form").form('reset');
                  $(".ui.form").form('clear');
                  toastr.success('Language Test has been added!');
                  $('.modal.add-new-language-test').modal('hide');
                }
              });

              if (!Session.get("add-lang-test-success")) {
                Session.set("add-lang-test-success", false);
                return false;
              }
            }else {
              toastr.error('Max 20 questions are allowed!');
              return false;
            }


          }else {
            toastr.error('Please correct the errors!');
            return false;
          }
        }
      })
      .modal('show');
  },

  //// add tech test

  'click #preview-tech-test-response-action'(event, instance) {
    const response = PredefinedTechnicalTestResponses.findOne({ template: this._id });
    if (response) {
      FlowRouter.go('preview_tech_test_response', { responseId: response._id });
    }else {
      toastr.warning("There is no response for this test");
    }
  },


  'click #remove-technical-test'(event, instance) {
    Meteor.call('remove_technical_test', this._id);
  },

  'click .button.add-tech-test'(event, instance) {
    $('.modal.add-new-technical-test')
      .modal({
        //blurring: true,
        onShow() {},
        onHidden() {},
        onDeny() {
          $('.ui.form.technical').form('reset');
          $('.ui.form.technical').form('clear');
          Session.set("add-tech-test-success", false);
        },
        onApprove() {
          $('.ui.form.technical')
            .form({
              fields: {
                techtestname        : 'empty',
                selecttechtestlevel : 'empty',
                selecttechsector    : 'empty',
              }
            });

          if ($('.ui.form.technical').form('is valid')) {
            const testname = $('#techtestname').val();
            const sector = $('#selecttechsector').val();
            const level = $('#selecttechtestlevel').val();
            const numberofquestions = $('#technumberofquestions').val();

            if (numberofquestions <= 20) {
              Meteor.call('create_new_technical_test_template', testname, sector, level, numberofquestions, function (err, data) {
                if (err) {
                  toastr.error(err.reason);
                  Session.set("add-tech-test-success", false);
                }else {
                  Session.set("add-tech-test-success", false);
                  $(".ui.form.technical").form('reset');
                  $(".ui.form.technical").form('clear');
                  toastr.success('Technical Test has been added!');
                  $('.modal.add-new-technical-test').modal('hide');
                }
              });

              if (!Session.get("add-tech-test-success")) {
                Session.set("add-tech-test-success", false);
                return false;
              }
            }else {
              toastr.error('Max 20 questions are allowed!');
              return false;
            }


          }else {
            toastr.error('Please correct the errors!');
            return false;
          }
        }
      })
      .modal('show');
  },


  'click .message .close.icon'(event, instance) {
    $('.ui.info.message').transition('fade');
  },

  'click #add_new_form_right'(event, instance) { // ana sayfadaki buton
    f_add_new_form(event ,instance);
  },
  'click #add_new_test_right'(event, instance) { // ana sayfadaki buton
    f_add_new_test(event ,instance);
  },
  'click #add_new_prerequisite_right'(event, instance) { // ana sayfadaki buton
    f_add_new_prerequisite(event ,instance);
  },
  'click #remove-form'(event, instance) {
    Meteor.call('remove_form', this._id);
  },
  'click #export-form-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-form-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-form-to-applicant input')
            .val(FlowRouter.url('user_formresponse') + '/' + _this._id);
        },
        onHidden() {
          $('#copytext').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  },

  'click #export-langtest-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-form-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-form-to-applicant input')
            .val(FlowRouter.url('user_langtestresponse') + '/' + _this._id);
        },
        onHidden() {
          $('#copytext').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  },

  'click #export-techtest-to-applicants'(event, instance) {
    const _this = this;
    $('.modal.export-form-to-applicant')
      .modal({
        //blurring: true,
        onShow() {
          const clipboard = new Clipboard('.copytoclipboard');
          clipboard.on('success', function(e) {
            $('#copytext').html("Copied");
          });
          // console.log(_this); // _this = tikladigimiz form tablosuna isaret ediyor.
          $('.twelve.wide.column.export-form-to-applicant input')
            .val(FlowRouter.url('user_techtestresponse') + '/' + _this._id);
        },
        onHidden() {
          $('#copytext').html("Copy");
        },
        onDeny() {},
        onApprove() {}
      })
      .modal('show');
  },
});


//////////////////////// ******************** CompanyPreviewForm

Template.CompanyPreviewForm.events({
  'click #submit-button'(event, instance) {

    const result_form = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    if (result_form.payload) {
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

        Meteor.call('add_new_response', response, FlowRouter.getParam('formId'), function(err, response_id) {
          Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err,data) {
            if (!err) {
              toastr.success("Your response has been saved!");
              FlowRouter.go('preview_form_response', { formId: FlowRouter.getParam('formId') });
            }else {
              toastr.warning(err);
            }
          })
        });
      }else {
        toastr.warning("Please answer the required questions!");
      }
    }else {
      toastr.warning("Form is empty!");
    }
  }
});

Template.CompanyPreviewForm.helpers({
  form() {
    const result_form = Forms.findOne(FlowRouter.getParam('formId'));
    if (result_form) {
      if (result_form.user === Meteor.userId()) {
        return result_form;
      }else {
        FlowRouter.go('notfound');
      }
    }
  }
});


//////////////////////// ******************** CompanyPreviewFormResponse


Template.CompanyPreviewFormResponse.helpers({
  form() {
    const form = Forms.findOne(FlowRouter.getParam('formId'));
    //console.log(form.title);
    Frm = form; // for development purpose only
    return form;
  },
  response() {
    const form_response = FormResponses.findOne({ $and : [{ form: FlowRouter.getParam('formId')}, {user: Meteor.userId()}]});
    if (form_response) {
      const response = Responses.findOne(form_response.response);
      //console.log(response);
      return response;
    }
  },
});

//////////////////////// ******************** CompanyListApplicantResponses


Template.CompanyListApplicantFormResponses.helpers({
  form() {
    return Forms.findOne(FlowRouter.getParam('formId'));
  },
  responses() {
    return FormResponses.find({ form: FlowRouter.getParam('formId') }, { sort : {createdAt: -1} })
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});


Template.CompanyPreviewApplicantFormResponse.helpers({
  form() {
    const form_response = FormResponses.findOne(FlowRouter.getParam('responseId'));
    if (form_response) {
      const form = Forms.findOne(form_response.form);
      //console.log(form.title);
      Frm = form; // for development purpose only
      return form;
    }
  },
  user_info() {
    const form_response = FormResponses.findOne(FlowRouter.getParam('responseId'));
    if (form_response) {
      if (form_response.user_name) {
        return form_response.user_name;
      }else {
        return form_response.email;
      }
    }
  },
  response() {
    const form_response = FormResponses.findOne(FlowRouter.getParam('responseId'));
    if (form_response) {
      const response = Responses.findOne(form_response.response);
      //console.log(response);
      return response;
    }
  },

});


//////////////////////// ******************** registerHelpers

Template.registerHelper('toJSON', function(payload){
  if (payload) {
    return JSON.parse(payload);
  }
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});

Template.registerHelper('equalsOr', function(s1, s2, s3){
  return s1 === s2 || s1 === s3;
});

// bu checkbox harici cevaplar icin kullaniliyor
Template.registerHelper('processFormResponseValue', function(type, val) {
  if(type == "address") {
    return `${val.address}, ${val.city}, ${val.country}`;
  }else {
    return val;
  }
});

// bu checkbox cevaplari icin kullaniliyor
Template.registerHelper('processFormResponseValueCheckbox', function(val, result) {
  if (result){ // eger form tipimiz test ise bu calisacak
    const overall = new Array();
    for(let i=0;i<val.length;i++) {
      overall.push({o_val: val[i], o_result: result[i]});
    }
    return overall;
  }else { // eger form tipimiz survey ise bu calisacak
    const overall = new Array();
    for(let i=0;i<val.length;i++) {
      overall.push({o_val: val[i]});
    }
    return overall;
  }
});

Template.registerHelper('responseExists', function(type, val) {
  if (type == "checkboxes") {
    return val.length > 0;
  }else if(type == "address") {
    return val.address || val.city || val.country;
  }else {
    return val;
  }
});

Template.registerHelper("getResponseData", function(response_id){
  return Responses.findOne(response_id);
});

Template.registerHelper("coming_from_single_forms", function(){
  return Session.get("coming_from") === "single_forms";
});

Template.registerHelper("current_application_id", function(){
  return Session.get("current_application_id");
});





// language and technical test previews

Template.CompanyPreviewLanguageTest.helpers({
  template_title() {
    const template = PredefinedLanguageTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      return template.title;
    }
  },
  questions() {
    const template = PredefinedLanguageTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      const all_questions = PredefinedLanguageQuestions.find({ $and : [{ level: template.level }, {language: template.language }]}).fetch();
      // burada cikan sonuclari shuffle ediyoruz / karistiriyoruz
      for(let i=0; i<all_questions.length;i++) {
        const rnd = Math.floor(Math.random() * all_questions.length);
        const tmp = all_questions[i];
        all_questions[i] = all_questions[rnd];
        all_questions[rnd] = tmp;
      }
      //console.log(all_questions.slice(0,template.numquestions));
      return all_questions.slice(0,template.numquestions);
    }
  }
});

Template.CompanyPreviewLanguageTest.events({
  'click #submit-button'(event, instance) {

    const question_ids = new Array();
    const selecteds = new Array();
    const field_validations = {};

    for(let i=0; i<$('label[id=question]').length;i++) {
      const id = $('label[id=question]')[i].attributes.for.value;
      const selected = $(`.formradio input[name=${id}]:checked`).val();
      question_ids.push(id);
      selecteds.push(parseInt(selected));
      field_validations[id] = 'checked';
    }

    $('.ui.form')
      .form({
        fields: field_validations
    });


    if ($('.ui.form').form('is valid')) {
      Meteor.call("calculate_score_for_lang_test", question_ids, selecteds, FlowRouter.getParam('templateId'), function(err, data) {
        if (!err) {
          toastr.info("Your response has been saved!");
          FlowRouter.go('preview_lang_test_response', { responseId: data });
        }else {
          toastr.warning(err.reason);
        }
      });
    }else {
      toastr.warning("Please answer the all questions!");
    }

  }
});

Template.CompanyLanguageTestResponse.helpers({
  response() {
    return PredefinedLanguageTestResponses.findOne(FlowRouter.getParam('responseId'));
  }
});

Template.CompanyPreviewApplicantLangTestResponse.helpers({
  response() {
    return PredefinedLanguageTestResponses.findOne(FlowRouter.getParam('responseId'));
  }
});

Template.CompanyPreviewApplicantTechTestResponse.helpers({
  response() {
    return PredefinedTechnicalTestResponses.findOne(FlowRouter.getParam('responseId'));
  }
});





Template.CompanyPreviewTechnicalTest.helpers({
  template_title() {
    const template = PredefinedTechnicalTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      return template.title;
    }
  },
  questions() {
    const template = PredefinedTechnicalTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      const all_questions = PredefinedTechnicalQuestions.find({ $and : [{ level: template.level }, {related_to: template.sector }]}).fetch();
      // burada cikan sonuclari shuffle ediyoruz / karistiriyoruz
      for(let i=0; i<all_questions.length;i++) {
        const rnd = Math.floor(Math.random() * all_questions.length);
        const tmp = all_questions[i];
        all_questions[i] = all_questions[rnd];
        all_questions[rnd] = tmp;
      }
      //console.log(all_questions.slice(0,template.numquestions));
      return all_questions.slice(0,template.numquestions);
    }
  }
});

Template.CompanyPreviewTechnicalTest.events({
  'click #submit-button'(event, instance) {

    const question_ids = new Array();
    const selecteds = new Array();
    const field_validations = {};

    for(let i=0; i<$('label[id=question]').length;i++) {
      const id = $('label[id=question]')[i].attributes.for.value;
      const selected = $(`.formradio input[name=${id}]:checked`).val();
      question_ids.push(id);
      selecteds.push(parseInt(selected));
      field_validations[id] = 'checked';
    }

    $('.ui.form')
      .form({
        fields: field_validations
    });


    if ($('.ui.form').form('is valid')) {
      Meteor.call("calculate_score_for_tech_test", question_ids, selecteds, FlowRouter.getParam('templateId'), function(err, data) {
        if (!err) {
          toastr.info("Your response has been saved!");
          FlowRouter.go('preview_tech_test_response', { responseId: data });
        }else {
          toastr.warning(err.reason);
        }
      });
    }else {
      toastr.warning("Please answer the all questions!");
    }

  }
});

Template.CompanyTechnicalTestResponse.helpers({
  template_title() {
    const response = PredefinedTechnicalTestResponses.findOne({ $and : [{ _id: FlowRouter.getParam('responseId')}, {user: Meteor.userId()}]});
    if (response) {
      return response.template_title;
    }
  },
  response() {
    return PredefinedTechnicalTestResponses.findOne({ $and : [{ _id: FlowRouter.getParam('responseId')}, {user: Meteor.userId()}]});
  }
});





///////// preview applicant responses

Template.CompanyListLangApplicantFormResponses.helpers({
  template_title() {
    const template = PredefinedLanguageTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      return template.title;
    }
  },
  responses() {
    return PredefinedLanguageTestResponses.find({ template: FlowRouter.getParam('templateId')})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});

Template.CompanyListTechApplicantFormResponses.helpers({
  template_title() {
    const template = PredefinedTechnicalTemplates.findOne(FlowRouter.getParam('templateId'));
    if (template) {
      return template.title;
    }
  },
  responses() {
    return PredefinedTechnicalTestResponses.find({ template: FlowRouter.getParam('templateId')})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  }
});
