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
          $("a[data-field-type='range_group']").remove();
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
    const fields = JSON.parse(Frm.payload).fields;

    const response = new Array();

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
        response.push({label: field.label, cid: field.cid, val: selected, type: field.field_type});

      } else if (field.field_type === 'dropdown') {
        const drop_select = $(`.formdropdown select[name=${field.cid}]`).val();
        response.push({label: field.label, cid: field.cid, val: drop_select, type: field.field_type});

      } else if (field.field_type === 'number') {
        const number = $(`.number input[name=${field.cid}]`).val();
        response.push({label: field.label, cid: field.cid, val: number, type: field.field_type});
      }
    });

    Meteor.call('add_new_response', response, function(err, response_id) {
      Meteor.call('save_form_response_preview', FlowRouter.getParam('formId'), response_id, function(err,data) {
        toastr.success("Your response has been saved!");
        FlowRouter.go('preview_form_response', { formId: FlowRouter.getParam('formId') });
      })
    });

  }
});

Template.CompanyPreviewForm.helpers({
  form() {
    Frm = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    return Frm;
  }
});


//////////////////////// ******************** CompanyPreviewFormResponse


Template.CompanyPreviewFormResponse.helpers({
  form_title() {
    return Forms.findOne({ _id: FlowRouter.getParam('formId') }).title;
  },
  response() {
    const form_response = FormResponses.findOne({ $and : [{ form: FlowRouter.getParam('formId')}, {user: Meteor.userId()}]});
    return Responses.findOne(form_response.response);
  },
});

Template.registerHelper('toJSON', function(payload){
  return JSON.parse(payload);
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});

Template.registerHelper('processFormResponseValue', function(type, val) {
  if (type == "checkboxes") {
    return val.join(',');
  }else if(type == "address") {
    return `${val.address}, ${val.city}, ${val.country}`;
  }else {
    return val;
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
