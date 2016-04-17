import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Forms } from '/imports/api/collections/forms.js'; // Forms collections

import './form_response.html'; // UserFormResponseLayout


Template.UserFormResponseLayout.helpers({
  form() {
    return Forms.findOne(FlowRouter.getParam('formId'));
  }
});

Template.UserFormResponseLayout.events({
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
          FlowRouter.go('home');
        })
      });
    }else {
      toastr.warning("Please answer the required questions!");
    }

  }
});
