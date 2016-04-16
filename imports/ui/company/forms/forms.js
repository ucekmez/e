import { Template } from 'meteor/templating';
import { Forms, Responses, FormResponses } from '/imports/api/collections/forms.js'; // Forms collections

import './edit_form.html'; // CompanyEditFormLayout CompanyEditForm
import './list_forms.html'; // CompanyListForms
import './preview_form.html'; // CompanyPreviewForm



//////////////////////// ******************** CompanyEditForm

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
      if (form.type == 'test') {
          $("a[data-field-type='address']").remove();
          $("a[data-field-type='number']").remove();
          $("a[data-field-type='date']").remove();
          $("a[data-field-type='paragraph']").remove();
          $("a[data-field-type='range']").remove();
          $("a[data-field-type='dropdown']").remove();
          $("a[data-field-type='section_break']").remove();
      }
    }
  });
});


//////////////////////// ******************** CompanyListForms

Template.CompanyListForms.helpers({
  forms() {
    return Forms.find({ user: Meteor.userId() },{ sort: { createdAt: -1}})
      .map(function(document, index) {
        document.index = index + 1;
        return document;
      });
  },
});

Template.CompanyListForms.events({
  'click #remove-form'(event, instance) {
    Meteor.call('remove_form', this._id);
  }
});


//////////////////////// ******************** CompanyPreviewForm

Template.CompanyPreviewForm.events({
  'click #submit-button'(event, instance) {

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

      Meteor.call('add_new_response', response, FlowRouter.getParam('formId'), function(err, response_id) {
        Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err,data) {
          toastr.success("Your response has been saved!");
          FlowRouter.go('preview_form_response', { formId: FlowRouter.getParam('formId') });
        })
      });
    }else {
      toastr.warning("Please answer the required questions!");
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

//////////////////////// ******************** CompanyPreviewTestResponse



//////////////////////// ******************** registerHelpers

Template.registerHelper('toJSON', function(payload){
  return JSON.parse(payload);
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
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
