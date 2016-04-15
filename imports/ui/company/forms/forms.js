import { Template } from 'meteor/templating';
import { Forms } from '/imports/api/collections/forms.js'; // Forms collections

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
        Meteor.call("update_form_payload", form._id, payload, function(data) {
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
        response.push({cid: field.cid, val: text});
      } else if (field.field_type === 'checkbox') {
        const checks = $(`.checkbox input[name=${field.cid}]:checked`).map(function() {
          return this.value;
        }).get();
        response.push({cid: field.cid, val: checks});
      } else if (field.field_type === 'range') {
        const range = $(`.range input[name=${field.cid}]`).val();
        response.push({cid: field.cid, val: range});
      } else if (field.field_type === 'address') {
        const address = $(`.address input[name=${Fields[3].cid}_address]`).val();
        const city    = $(`.address input[name=${Fields[3].cid}_city]`).val();
        const country = $(`.address input[name=${Fields[3].cid}_country]`).val();
        response.push({cid: field.cid, val: [{address: address, city: city, country: country}]});
      } else if (field.field_type === 'radio') {
        const selected = $(`.radio input[name=${field.cid}]:checked`).val();
        response.push({cid: field.cid, val: selected});
      } else if (field.field_type === 'dropdown') {
        const drop_select = $(`.dropdown select[name=${field.cid}]`).val();
        response.push({cid: field.cid, val: drop_select});
      } else if (field.field_type === 'number') {
        const number = $(`.number input[name=${field.cid}]`).val();
        response.push({cid: field.cid, val: number});
      }
    });

  }
});

Template.CompanyPreviewForm.helpers({
  form() {
    Frm = Forms.findOne({ _id: FlowRouter.getParam('formId') });
    return Frm;
  }
});

Template.registerHelper('toJSON', function(payload){
  return JSON.parse(payload);
});

Template.registerHelper('equals', function(s1, s2){
  return s1 === s2;
});
